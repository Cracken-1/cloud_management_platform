import { headers } from 'next/headers';
import TenantDashboard from '@/components/admin/tenant-dashboard';
import DynamicDashboard from '@/components/admin/dynamic-dashboard';

export default async function AdminPage() {
  const headersList = await headers();
  const isDemoSession = headersList.get('x-demo-session') === 'true';
  const demoCompany = headersList.get('x-demo-company');
  
  if (isDemoSession && demoCompany) {
    // Use dynamic dashboard for demo sessions
    return <DynamicDashboard companyId={demoCompany} />;
  }
  
  // For regular sessions, use tenant dashboard
  const tenantId = 'demo-tenant-1';
  return <TenantDashboard tenantId={tenantId} />;
}