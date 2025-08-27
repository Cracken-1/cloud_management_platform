import TenantDashboard from '@/components/admin/tenant-dashboard';

export default function AdminPage() {
  // For demo purposes, using a placeholder tenantId
  // In production, this would come from authentication/session
  const tenantId = 'demo-tenant-1';
  
  return <TenantDashboard tenantId={tenantId} />;
}