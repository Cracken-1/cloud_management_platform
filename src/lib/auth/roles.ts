// Enhanced Role-Based Access Control System
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  STORE_MANAGER = 'STORE_MANAGER',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  INVENTORY_MANAGER = 'INVENTORY_MANAGER',
  ANALYTICS_VIEWER = 'ANALYTICS_VIEWER',
  FRANCHISE_MANAGER = 'FRANCHISE_MANAGER'
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface AdminPermissions {
  // Core Operations
  products: ['create', 'read', 'update', 'delete'];
  inventory: ['create', 'read', 'update', 'delete', 'forecast'];
  orders: ['create', 'read', 'update', 'delete', 'process'];
  customers: ['read', 'update', 'support'];
  
  // Enhanced Features
  analytics: ['read', 'export'];
  pricing: ['read', 'update', 'dynamic_pricing'];
  suppliers: ['create', 'read', 'update', 'delete', 'performance_tracking'];
  staff: ['create', 'read', 'update', 'schedule'];
  
  // Kenya-specific
  mpesa: ['read', 'process', 'reconcile'];
  localization: ['read', 'update'];
  delivery: ['read', 'update', 'optimize_routes'];
}

export interface SuperadminPermissions extends AdminPermissions {
  // Platform Management
  system: ['read', 'update', 'monitor', 'backup'];
  integrations: ['create', 'read', 'update', 'delete', 'configure'];
  tenants: ['create', 'read', 'update', 'delete', 'manage'];
  security: ['read', 'update', 'audit', 'compliance'];
  
  // AI & ML Features
  ai_models: ['create', 'read', 'update', 'delete', 'train', 'deploy'];
  fraud_detection: ['read', 'update', 'configure'];
  
  // Advanced Analytics
  business_intelligence: ['read', 'create', 'export', 'configure'];
  market_analysis: ['read', 'create', 'export'];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'inventory', actions: ['create', 'read', 'update', 'delete', 'forecast'] },
    { resource: 'orders', actions: ['create', 'read', 'update', 'delete', 'process'] },
    { resource: 'customers', actions: ['read', 'update', 'support'] },
    { resource: 'analytics', actions: ['read', 'export'] },
    { resource: 'pricing', actions: ['read', 'update', 'dynamic_pricing'] },
    { resource: 'suppliers', actions: ['create', 'read', 'update', 'delete', 'performance_tracking'] },
    { resource: 'staff', actions: ['create', 'read', 'update', 'schedule'] },
    { resource: 'mpesa', actions: ['read', 'process', 'reconcile'] },
    { resource: 'localization', actions: ['read', 'update'] },
    { resource: 'delivery', actions: ['read', 'update', 'optimize_routes'] }
  ],
  
  [UserRole.SUPERADMIN]: [
    // Inherits all admin permissions plus:
    { resource: 'system', actions: ['read', 'update', 'monitor', 'backup'] },
    { resource: 'integrations', actions: ['create', 'read', 'update', 'delete', 'configure'] },
    { resource: 'tenants', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'security', actions: ['read', 'update', 'audit', 'compliance'] },
    { resource: 'ai_models', actions: ['create', 'read', 'update', 'delete', 'train', 'deploy'] },
    { resource: 'fraud_detection', actions: ['read', 'update', 'configure'] },
    { resource: 'business_intelligence', actions: ['read', 'create', 'export', 'configure'] },
    { resource: 'market_analysis', actions: ['read', 'create', 'export'] }
  ],
  
  [UserRole.STORE_MANAGER]: [
    { resource: 'products', actions: ['read', 'update'] },
    { resource: 'inventory', actions: ['read', 'update'] },
    { resource: 'orders', actions: ['read', 'update', 'process'] },
    { resource: 'customers', actions: ['read', 'support'] },
    { resource: 'staff', actions: ['read', 'schedule'] }
  ],
  
  [UserRole.CUSTOMER_SERVICE]: [
    { resource: 'customers', actions: ['read', 'update', 'support'] },
    { resource: 'orders', actions: ['read', 'update'] },
    { resource: 'products', actions: ['read'] }
  ],
  
  [UserRole.INVENTORY_MANAGER]: [
    { resource: 'inventory', actions: ['create', 'read', 'update', 'delete', 'forecast'] },
    { resource: 'products', actions: ['read', 'update'] },
    { resource: 'suppliers', actions: ['read', 'update', 'performance_tracking'] }
  ],
  
  [UserRole.ANALYTICS_VIEWER]: [
    { resource: 'analytics', actions: ['read'] },
    { resource: 'products', actions: ['read'] },
    { resource: 'orders', actions: ['read'] }
  ],
  
  [UserRole.FRANCHISE_MANAGER]: [
    { resource: 'products', actions: ['read'] },
    { resource: 'inventory', actions: ['read'] },
    { resource: 'orders', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'staff', actions: ['read'] }
  ]
};

export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  const resourcePermission = permissions.find(p => p.resource === resource);
  return resourcePermission?.actions.includes(action) ?? false;
}

export function getUserPermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}

export function isSuperadmin(userRole: UserRole): boolean {
  return userRole === UserRole.SUPERADMIN;
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN || userRole === UserRole.SUPERADMIN;
}