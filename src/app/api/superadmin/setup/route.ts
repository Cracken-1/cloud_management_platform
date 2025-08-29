import { NextResponse } from 'next/server';
import { superadminSetup, SuperadminSetupData } from '@/lib/auth/superadmin-setup';

interface SuperadminSetupRequest extends SuperadminSetupData {
  isGoogleAuth?: boolean;
  googleUserId?: string;
}

export async function POST(request: Request) {
  try {
    const setupData: SuperadminSetupRequest = await request.json();
    
    // Validate required fields (password not required for Google OAuth)
    const requiredFields = setupData.isGoogleAuth 
      ? ['email', 'firstName', 'lastName', 'organizationName', 'phoneNumber', 'securityCode']
      : ['email', 'password', 'firstName', 'lastName', 'organizationName', 'phoneNumber', 'securityCode'];
      
    for (const field of requiredFields) {
      const value = setupData[field as keyof SuperadminSetupRequest];
      if (!value) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create superadmin
    const result = await superadminSetup.createSuperadmin(setupData);
    
    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });
    
  } catch (error) {
    console.error('Superadmin setup API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if superadmin already exists
    const exists = await superadminSetup.checkExistingSuperadmin();
    
    return NextResponse.json({
      superadminExists: exists
    });
    
  } catch (error) {
    console.error('Superadmin check API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check superadmin status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}