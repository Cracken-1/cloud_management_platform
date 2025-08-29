import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database';

export interface SuperadminSetupData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName: string;
    phoneNumber: string;
    securityCode: string;
}

export interface SetupResult {
    success: boolean;
    message: string;
    userId?: string;
    tenantId?: string;
    error?: Error;
}

export class SuperadminSetup {
    private supabase;
    private readonly SYSTEM_TENANT_ID = '00000000-0000-0000-0000-000000000000';
    private readonly SECURITY_CODE = process.env.NEXT_PUBLIC_SUPERADMIN_CODE;

    constructor() {
        this.supabase = createClientComponentClient<Database>();
    }

    /**
     * Validates the security code for superadmin registration
     */
    validateSecurityCode(code: string): boolean {
        if (!this.SECURITY_CODE) {
            throw new Error('Superadmin security code not configured. Please set NEXT_PUBLIC_SUPERADMIN_CODE environment variable.');
        }
        return code === this.SECURITY_CODE;
    }

    /**
     * Checks if any superadmin already exists in the system
     */
    async checkExistingSuperadmin(): Promise<boolean> {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('id')
                .eq('role', 'SUPERADMIN')
                .limit(1);

            if (error) throw error;
            return (data?.length || 0) > 0;
        } catch (error) {
            console.error('Error checking existing superadmin:', error);
            return false;
        }
    }

    /**
     * Creates the system tenant if it doesn't exist
     */
    private async ensureSystemTenant(organizationName: string): Promise<string> {
        try {
            // Check if system tenant exists
            const { data: existingTenant } = await this.supabase
                .from('tenants')
                .select('id')
                .eq('id', this.SYSTEM_TENANT_ID)
                .single();

            if (existingTenant) {
                return this.SYSTEM_TENANT_ID;
            }

            // Create system tenant
            const { data: tenant, error } = await this.supabase
                .from('tenants')
                .insert({
                    id: this.SYSTEM_TENANT_ID,
                    name: organizationName,
                    domain: 'system.admin.platform',
                    subscription_tier: 'ENTERPRISE',
                    is_active: true,
                    business_type: 'PLATFORM',
                    currency: 'USD',
                    timezone: 'UTC',
                    settings: {
                        platform_admin: true,
                        multi_tenant_enabled: true,
                        advanced_features: true,
                        maintenance_mode: false,
                        registration_enabled: true
                    },
                    branding: {
                        primary_color: '#1f2937',
                        secondary_color: '#6b7280',
                        accent_color: '#3b82f6',
                        logo_url: null,
                        favicon_url: null
                    }
                })
                .select('id')
                .single();

            if (error) throw error;
            return tenant.id;
        } catch (error) {
            console.error('Error ensuring system tenant:', error);
            throw new Error('Failed to create system tenant');
        }
    }

    /**
     * Creates a superadmin user with full platform access
     */
    async createSuperadmin(setupData: SuperadminSetupData & { isGoogleAuth?: boolean; googleUserId?: string }): Promise<SetupResult> {
        try {
            // Validate security code
            if (!this.validateSecurityCode(setupData.securityCode)) {
                return {
                    success: false,
                    message: 'Invalid security code provided'
                };
            }

            // Check if superadmin already exists
            const existingSuperadmin = await this.checkExistingSuperadmin();
            if (existingSuperadmin) {
                return {
                    success: false,
                    message: 'A superadmin already exists in the system'
                };
            }

            let userId: string;

            if (setupData.isGoogleAuth && setupData.googleUserId) {
                // User already authenticated with Google, get their session
                const { data: { session } } = await this.supabase.auth.getSession();
                if (!session || session.user.id !== setupData.googleUserId) {
                    return {
                        success: false,
                        message: 'Google authentication session not found or invalid'
                    };
                }
                userId = session.user.id;
            } else {
                // Create user with email/password
                const { data: signUpData, error: authError } = await this.supabase.auth.signUp({
                    email: setupData.email,
                    password: setupData.password,
                    options: {
                        data: {
                            first_name: setupData.firstName,
                            last_name: setupData.lastName,
                            role: 'SUPERADMIN',
                            phone_number: setupData.phoneNumber
                        },
                        emailRedirectTo: `${window.location.origin}/superadmin/login?verified=true`
                    }
                });

                if (authError) {
                    return {
                        success: false,
                        message: `Authentication error: ${authError.message}`,
                        error: authError
                    };
                }

                if (!signUpData.user) {
                    return {
                        success: false,
                        message: 'Failed to create user account'
                    };
                }

                userId = signUpData.user.id;
                
                // For superadmin, we'll mark as verified immediately for development
                // In production, you might want to require email verification
                if (process.env.NODE_ENV === 'development') {
                    // Auto-verify for development
                    try {
                        await this.supabase.auth.admin.updateUserById(userId, {
                            email_confirm: true
                        });
                    } catch (adminError) {
                        console.warn('Could not auto-verify email (admin access required):', adminError);
                    }
                }
            }

            // Ensure system tenant exists
            const tenantId = await this.ensureSystemTenant(setupData.organizationName);

            // Create user profile
            const isVerified = setupData.isGoogleAuth || process.env.NODE_ENV === 'development';
            const { error: profileError } = await this.supabase
                .from('user_profiles')
                .insert({
                    id: userId,
                    email: setupData.email,
                    first_name: setupData.firstName,
                    last_name: setupData.lastName,
                    phone_number: setupData.phoneNumber,
                    role: 'SUPERADMIN',
                    is_active: true,
                    is_verified: isVerified,
                    email_verified_at: isVerified ? new Date().toISOString() : null,
                    last_login_at: null,
                    preferences: {
                        theme: 'light',
                        notifications: {
                            email: true,
                            push: true,
                            sms: false
                        },
                        dashboard: {
                            default_view: 'overview',
                            items_per_page: 25
                        }
                    }
                });

            if (profileError) {
                return {
                    success: false,
                    message: `Profile creation error: ${profileError.message}`,
                    error: profileError
                };
            }

            // Assign superadmin role to system tenant
            const { error: roleError } = await this.supabase
                .from('user_tenant_roles')
                .insert({
                    user_id: userId,
                    tenant_id: tenantId,
                    role: 'SUPERADMIN',
                    granted_by: userId,
                    granted_at: new Date().toISOString(),
                    permissions: {
                        platform_admin: true,
                        tenant_management: true,
                        user_management: true,
                        system_settings: true,
                        analytics: true,
                        billing: true
                    }
                });

            if (roleError) {
                return {
                    success: false,
                    message: `Role assignment error: ${roleError.message}`,
                    error: roleError
                };
            }

            // Initialize platform settings
            await this.initializePlatformSettings(userId);

            return {
                success: true,
                message: 'Superadmin account created successfully',
                userId: userId,
                tenantId: tenantId
            };

        } catch (error) {
            console.error('Superadmin setup error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred during setup',
                error: error instanceof Error ? error : new Error('Unknown error')
            };
        }
    }

    /**
     * Initializes default platform settings and configurations
     */
    private async initializePlatformSettings(superadminId: string): Promise<void> {
        try {
            // Create default platform settings
            const defaultSettings = {
                platform: {
                    name: 'Adaptive Cloud Management Platform',
                    version: '1.0.0',
                    maintenance_mode: false,
                    registration_enabled: true,
                    email_verification_required: true
                },
                security: {
                    password_min_length: 12,
                    password_require_special: true,
                    session_timeout: 24, // hours
                    max_login_attempts: 5,
                    lockout_duration: 30 // minutes
                },
                features: {
                    multi_tenant: true,
                    ai_features: true,
                    analytics: true,
                    api_access: true,
                    webhooks: true
                },
                integrations: {
                    payment_gateways: ['mpesa', 'stripe'],
                    email_service: 'supabase',
                    storage_service: 'supabase',
                    analytics_service: 'internal'
                }
            };

            // Store platform settings
            const { error: settingsError } = await this.supabase
                .from('platform_settings')
                .upsert({
                    id: 'default',
                    settings: defaultSettings,
                    created_by: superadminId,
                    updated_by: superadminId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (settingsError) {
                console.error('Error initializing platform settings:', settingsError);
            }

            // Create audit log entry
            await this.createAuditLog({
                user_id: superadminId,
                action: 'SUPERADMIN_CREATED',
                resource_type: 'USER',
                resource_id: superadminId,
                details: {
                    message: 'Superadmin account created and platform initialized',
                    ip_address: null,
                    user_agent: null
                }
            });

        } catch (error) {
            console.error('Error initializing platform settings:', error);
            // Don't throw error as this is not critical for account creation
        }
    }

    /**
     * Creates an audit log entry
     */
    private async createAuditLog(logData: {
        user_id: string;
        action: string;
        resource_type: string;
        resource_id: string;
        details: Record<string, unknown>;
    }): Promise<void> {
        try {
            await this.supabase
                .from('audit_logs')
                .insert({
                    ...logData,
                    timestamp: new Date().toISOString()
                });
        } catch (error) {
            console.error('Error creating audit log:', error);
        }
    }

    /**
     * Validates superadmin credentials and permissions
     */
    async validateSuperadmin(userId: string): Promise<boolean> {
        try {
            const { data: profile } = await this.supabase
                .from('user_profiles')
                .select('role, is_active')
                .eq('id', userId)
                .single();

            if (!profile || profile.role !== 'SUPERADMIN' || !profile.is_active) {
                return false;
            }

            // Check if user has superadmin role in system tenant
            const { data: role } = await this.supabase
                .from('user_tenant_roles')
                .select('role')
                .eq('user_id', userId)
                .eq('tenant_id', this.SYSTEM_TENANT_ID)
                .eq('role', 'SUPERADMIN')
                .single();

            return !!role;
        } catch (error) {
            console.error('Error validating superadmin:', error);
            return false;
        }
    }

    /**
     * Gets superadmin profile information
     */
    async getSuperadminProfile(userId: string): Promise<Record<string, unknown> | null> {
        try {
            const { data: profile, error } = await this.supabase
                .from('user_profiles')
                .select(`
          *,
          user_tenant_roles!inner(
            tenant_id,
            role,
            permissions,
            granted_at
          )
        `)
                .eq('id', userId)
                .eq('role', 'SUPERADMIN')
                .single();

            if (error) throw error;
            return profile;
        } catch (error) {
            console.error('Error getting superadmin profile:', error);
            return null;
        }
    }

    /**
     * Updates superadmin profile
     */
    async updateSuperadminProfile(userId: string, updates: Partial<{
        first_name: string;
        last_name: string;
        phone_number: string;
        preferences: Record<string, unknown>;
    }>): Promise<SetupResult> {
        try {
            const { error } = await this.supabase
                .from('user_profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .eq('role', 'SUPERADMIN');

            if (error) throw error;

            await this.createAuditLog({
                user_id: userId,
                action: 'PROFILE_UPDATED',
                resource_type: 'USER',
                resource_id: userId,
                details: { updates }
            });

            return {
                success: true,
                message: 'Profile updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update profile',
                error: error instanceof Error ? error : new Error('Unknown error')
            };
        }
    }
}

// Export singleton instance
export const superadminSetup = new SuperadminSetup();