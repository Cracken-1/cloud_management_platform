import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: requestId } = params;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // In a real implementation:
    // 1. Update request status in database
    // 2. Send email notification to user with rejection reason
    // 3. Log admin action for audit trail

    console.log('Rejecting password reset request:', requestId, 'Reason:', reason);

    return NextResponse.json({
      success: true,
      message: 'Password reset request rejected successfully'
    });
  } catch (error) {
    console.error('Failed to reject password reset request:', error);
    return NextResponse.json(
      { error: 'Failed to reject request' },
      { status: 500 }
    );
  }
}
