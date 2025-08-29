import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        // Validate required fields
        const requiredFields = ['email', 'firstName', 'lastName', 'company', 'businessType', 'phoneNumber', 'businessDescription'];
        for (const field of requiredFields) {
            if (!requestData[field]) {
                return NextResponse.json(
                    { success: false, message: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Validate corporate email (not personal email providers)
        const personalEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
        const emailDomain = requestData.email.split('@')[1]?.toLowerCase();
        if (personalEmailProviders.includes(emailDomain)) {
            return NextResponse.json(
                { success: false, message: 'Please use your corporate/work email address' },
                { status: 400 }
            );
        }

        // Check if request already exists
        const { data: existingRequest } = await supabase
            .from('registration_requests')
            .select('id, status')
            .eq('email', requestData.email)
            .single();

        if (existingRequest) {
            if (existingRequest.status === 'PENDING') {
                return NextResponse.json(
                    { success: false, message: 'A request with this email is already pending review' },
                    { status: 400 }
                );
            } else if (existingRequest.status === 'APPROVED') {
                return NextResponse.json(
                    { success: false, message: 'This email has already been approved. Please contact support if you need assistance.' },
                    { status: 400 }
                );
            }
        }

        // Create registration request
        const { data: registrationRequest, error } = await supabase
            .from('registration_requests')
            .insert({
                email: requestData.email,
                first_name: requestData.firstName,
                last_name: requestData.lastName,
                company: requestData.company,
                business_type: requestData.businessType,
                phone_number: requestData.phoneNumber,
                business_registration_number: requestData.businessRegistrationNumber || null,
                business_description: requestData.businessDescription,
                estimated_monthly_volume: requestData.estimatedMonthlyVolume || null,
                referral_source: requestData.referralSource || null,
                requested_role: 'ADMIN',
                status: 'PENDING',
                submitted_at: new Date().toISOString(),
                metadata: {
                    isGoogleAuth: requestData.isGoogleAuth || false,
                    googleUserId: requestData.googleUserId || null,
                    userAgent: request.headers.get('user-agent'),
                    ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
                }
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating registration request:', error);
            return NextResponse.json(
                { success: false, message: 'Failed to submit request. Please try again.' },
                { status: 500 }
            );
        }

        // Create audit log entry
        await supabase
            .from('audit_logs')
            .insert({
                user_id: null,
                action: 'ACCESS_REQUEST_SUBMITTED',
                resource_type: 'REGISTRATION_REQUEST',
                resource_id: registrationRequest.id,
                details: `Access request submitted for ${requestData.email} from ${requestData.company}`,
                metadata: {
                    email: requestData.email,
                    company: requestData.company,
                    businessType: requestData.businessType
                },
                created_at: new Date().toISOString()
            });

        // TODO: Send notification email to superadmins about new request
        // This would typically integrate with your email service

        return NextResponse.json({
            success: true,
            message: 'Access request submitted successfully',
            requestId: registrationRequest.id
        });

    } catch (error) {
        console.error('Access request API error:', error);
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