import { NextRequest } from 'next/server';

export interface DemoSession {
  companyId: string;
  companyName: string;
  industry: string;
  email: string;
  role: string;
  isDemo: boolean;
  timestamp: number;
}

export function getDemoSession(request: NextRequest): DemoSession | null {
  try {
    const demoToken = request.cookies.get('demo-session')?.value;
    if (!demoToken) return null;

    const sessionData = JSON.parse(Buffer.from(demoToken, 'base64').toString());
    
    // Check if session is expired (24 hours)
    if (Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000) {
      return null;
    }

    return sessionData as DemoSession;
  } catch {
    return null;
  }
}

export function isValidDemoSession(session: DemoSession | null): boolean {
  return session !== null && session.isDemo === true;
}