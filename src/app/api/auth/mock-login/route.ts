import { NextRequest, NextResponse } from 'next/server';

// Mock company data for demo purposes
const mockCompanies = {
  'freshfoods': {
    name: 'Fresh Foods Restaurant',
    industry: 'restaurant',
    websiteUrl: 'https://freshfoodsrestaurant.com',
    adminEmail: 'admin@freshfoods.com'
  },
  'techmart': {
    name: 'TechMart Electronics',
    industry: 'retail',
    websiteUrl: 'https://techmartstore.com',
    adminEmail: 'admin@techmart.com'
  },
  'swiftlogistics': {
    name: 'Swift Logistics',
    industry: 'logistics',
    websiteUrl: 'https://swiftdelivery.com',
    adminEmail: 'admin@swiftlogistics.com'
  },
  'digitalsolutions': {
    name: 'Digital Solutions Inc',
    industry: 'technology',
    websiteUrl: 'https://digitalsoftware.com',
    adminEmail: 'admin@digitalsolutions.com'
  },
  'infinitystack': {
    name: 'InfinityStack Demo',
    industry: 'enterprise',
    websiteUrl: 'https://infinitystack.com',
    adminEmail: 'admin@infinitystack.com'
  }
};

export async function POST(request: NextRequest) {
  try {
    const { companyId } = await request.json();

    // Validate company exists
    const mockCompany = mockCompanies[companyId as keyof typeof mockCompanies];
    if (!mockCompany) {
      return NextResponse.json({ error: 'Invalid company ID' }, { status: 400 });
    }

    // Create a demo session token (in a real app, this would be a proper JWT)
    const demoToken = Buffer.from(JSON.stringify({
      companyId,
      companyName: mockCompany.name,
      industry: mockCompany.industry,
      email: mockCompany.adminEmail,
      role: 'ADMIN',
      isDemo: true,
      timestamp: Date.now()
    })).toString('base64');

    // Create response with session cookie
    const response = NextResponse.json({ 
      success: true,
      loginUrl: '/admin',
      companyName: mockCompany.name,
      message: `Demo login successful for ${mockCompany.name}`
    });

    // Set demo session cookie
    response.cookies.set('demo-session', demoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Mock login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
