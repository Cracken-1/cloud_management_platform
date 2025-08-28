import { NextRequest, NextResponse } from 'next/server';

// Mock data for password reset requests
const mockRequests = [
  {
    id: 'req-001',
    userId: 'user-001',
    userEmail: 'john.doe@example.com',
    userName: 'John Doe',
    requestedAt: '2025-01-19T08:30:00Z',
    reason: 'Forgot password after vacation, unable to access account',
    status: 'PENDING'
  },
  {
    id: 'req-002',
    userId: 'user-002',
    userEmail: 'jane.smith@example.com',
    userName: 'Jane Smith',
    requestedAt: '2025-01-18T14:15:00Z',
    reason: 'Account locked due to multiple failed login attempts',
    status: 'APPROVED',
    temporaryPassword: 'TempPass123!',
    expiresAt: '2025-01-25T14:15:00Z',
    approvedBy: 'admin-001',
    approvedAt: '2025-01-18T15:30:00Z'
  },
  {
    id: 'req-003',
    userId: 'user-003',
    userEmail: 'mike.wilson@example.com',
    userName: 'Mike Wilson',
    requestedAt: '2025-01-17T10:45:00Z',
    reason: 'Security breach concern, need immediate password reset',
    status: 'REJECTED',
    rejectedBy: 'admin-001',
    rejectedAt: '2025-01-17T11:00:00Z',
    rejectionReason: 'Insufficient verification provided. Please contact IT support directly.'
  }
];

export async function GET() {
  try {
    // In a real implementation, fetch from database with proper authentication
    return NextResponse.json({
      success: true,
      requests: mockRequests
    });
  } catch (error) {
    console.error('Failed to fetch password reset requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, reason } = await request.json();

    if (!userId || !reason) {
      return NextResponse.json(
        { error: 'User ID and reason are required' },
        { status: 400 }
      );
    }

    // In a real implementation, save to database
    const newRequest = {
      id: `req-${Date.now()}`,
      userId,
      userEmail: 'user@example.com', // Would fetch from user service
      userName: 'User Name', // Would fetch from user service
      requestedAt: new Date().toISOString(),
      reason,
      status: 'PENDING'
    };

    mockRequests.push(newRequest);

    return NextResponse.json({
      success: true,
      request: newRequest
    });
  } catch (error) {
    console.error('Failed to create password reset request:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
