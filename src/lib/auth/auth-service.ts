import { supabase, supabaseAdmin } from '@/lib/database/supabase';
import { UserRole } from './roles';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  tenantId?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  businessType: string;
  phoneNumber: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  businessAddress: string;
  requestedRole: 'ADMIN' | 'STORE_MANAGER';
  businessDescription: string;
  estimatedMonthlyVolume: string;
  referralSource: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  requiresVerification?: boolean;
}

export class AuthService {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Authentication failed' };
      }

      // Get user profile with role information
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'User profile not found' };
      }

      // Check if user is active and verified
      if (!profile.is_active) {
        return { success: false, error: 'Account is deactivated. Contact administrator.' };
      }

      if (!profile.is_verified) {
        return { 
          success: false, 
          error: 'Account pending verification. Please wait for admin approval.',
          requiresVerification: true 
        };
      }

      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id);

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        role: profile.role as UserRole,
        firstName: profile.first_name,
        lastName: profile.last_name,
        isActive: profile.is_active,
        isVerified: profile.is_verified,
        tenantId: profile.tenant_id,
        createdAt: profile.created_at,
        lastLoginAt: profile.last_login_at
      };

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Submit registration request (does not create active user)
  async submitRegistrationRequest(request: RegistrationRequest): Promise<AuthResponse> {
    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', request.email)
        .single();

      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Check for existing pending request
      const { data: existingRequest } = await supabase
        .from('registration_requests')
        .select('email')
        .eq('email', request.email)
        .eq('status', 'PENDING')
        .single();

      if (existingRequest) {
        return { 
          success: false, 
          error: 'Registration request already submitted. Please wait for admin review.' 
        };
      }

      // Create registration request
      const { error: requestError } = await supabase
        .from('registration_requests')
        .insert({
          email: request.email,
          first_name: request.firstName,
          last_name: request.lastName,
          company: request.company,
          business_type: request.businessType,
          phone_number: request.phoneNumber,
          business_registration_number: request.businessRegistrationNumber,
          tax_id: request.taxId,
          business_address: request.businessAddress,
          requested_role: request.requestedRole,
          business_description: request.businessDescription,
          estimated_monthly_volume: request.estimatedMonthlyVolume,
          referral_source: request.referralSource,
          status: 'PENDING',
          submitted_at: new Date().toISOString()
        });

      if (requestError) {
        console.error('Registration request error:', requestError);
        return { success: false, error: 'Failed to submit registration request' };
      }

      // Send notification to superadmins (implement email/Slack notification)
      await this.notifyAdminsOfNewRequest(request);

      return { 
        success: true, 
        requiresVerification: true 
      };
    } catch (error) {
      console.error('Registration request error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  // Get current user session
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return null;

      return {
        id: user.id,
        email: user.email!,
        role: profile.role as UserRole,
        firstName: profile.first_name,
        lastName: profile.last_name,
        isActive: profile.is_active,
        isVerified: profile.is_verified,
        tenantId: profile.tenant_id,
        createdAt: profile.created_at,
        lastLoginAt: profile.last_login_at
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Admin-only: Create new user (bypasses registration request)
  async createUser(
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      tenantId?: string;
    },
    createdBy: string
  ): Promise<AuthResponse> {
    try {
      // Only superadmins can create users directly
      const { data: creator } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', createdBy)
        .single();

      if (!creator || creator.role !== 'SUPERADMIN') {
        return { success: false, error: 'Insufficient permissions' };
      }

      // Create auth user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Failed to create user' };
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          tenant_id: userData.tenantId,
          is_active: true,
          is_verified: true,
          created_by: createdBy,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        // Cleanup auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
        return { success: false, error: 'Failed to create user profile' };
      }

      const user: User = {
        id: data.user.id,
        email: userData.email,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: true,
        isVerified: true,
        tenantId: userData.tenantId,
        createdAt: new Date().toISOString()
      };

      return { success: true, user };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Admin-only: Approve registration request
  async approveRegistrationRequest(
    requestId: string, 
    approvedBy: string,
    assignedRole: UserRole,
    tenantId?: string
  ): Promise<AuthResponse> {
    try {
      // Get the registration request
      const { data: request, error: requestError } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('id', requestId)
        .eq('status', 'PENDING')
        .single();

      if (requestError || !request) {
        return { success: false, error: 'Registration request not found' };
      }

      // Generate temporary password
      const tempPassword = this.generateTempPassword();

      // Create user account
      const createResult = await this.createUser({
        email: request.email,
        password: tempPassword,
        firstName: request.first_name,
        lastName: request.last_name,
        role: assignedRole,
        tenantId
      }, approvedBy);

      if (!createResult.success) {
        return createResult;
      }

      // Update registration request status
      await supabase
        .from('registration_requests')
        .update({
          status: 'APPROVED',
          approved_by: approvedBy,
          approved_at: new Date().toISOString(),
          assigned_role: assignedRole,
          assigned_tenant_id: tenantId
        })
        .eq('id', requestId);

      // Send welcome email with temporary password (implement email service)
      await this.sendWelcomeEmail(request.email, tempPassword);

      return createResult;
    } catch (error) {
      console.error('Approve registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private async notifyAdminsOfNewRequest(request: RegistrationRequest): Promise<void> {
    // Implement notification to superadmins
    // This could be email, Slack, or in-app notification
    console.log('New registration request:', request.email);
  }

  private async sendWelcomeEmail(email: string, _tempPassword: string): Promise<void> {
    // Implement welcome email with temporary password
    console.log('Welcome email sent to:', email);
  }
}

export const authService = new AuthService();