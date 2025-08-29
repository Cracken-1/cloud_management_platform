/**
 * Superadmin Configuration
 * Centralized configuration for superadmin features and security
 */

export const SUPERADMIN_CONFIG = {
  // Security settings
  SECURITY: {
    // Default security code (should be overridden via environment variable)
    DEFAULT_SECURITY_CODE: 'SUPER_SECURE_2024',
    
    // Password requirements
    PASSWORD_MIN_LENGTH: 12,
    PASSWORD_REQUIRE_UPPERCASE: true,
    PASSWORD_REQUIRE_LOWERCASE: true,
    PASSWORD_REQUIRE_NUMBERS: true,
    PASSWORD_REQUIRE_SPECIAL: true,
    
    // Session settings
    SESSION_TIMEOUT_HOURS: 24,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 30,
  },

  // System tenant configuration
  SYSTEM_TENANT: {
    ID: '00000000-0000-0000-0000-000000000000',
    DOMAIN: 'system.admin.platform',
    NAME: 'Platform Administration',
    SUBSCRIPTION_TIER: 'ENTERPRISE',
  },

  // Default permissions for superadmin
  PERMISSIONS: {
    PLATFORM_ADMIN: true,
    TENANT_MANAGEMENT: true,
    USER_MANAGEMENT: true,
    SYSTEM_SETTINGS: true,
    ANALYTICS: true,
    BILLING: true,
    AUDIT_LOGS: true,
    API_ACCESS: true,
  },

  // Feature flags
  FEATURES: {
    MULTI_TENANT: true,
    AI_FEATURES: true,
    ADVANCED_ANALYTICS: true,
    WEBHOOK_SUPPORT: true,
    API_RATE_LIMITING: true,
    AUDIT_LOGGING: true,
  },

  // UI Configuration
  UI: {
    THEME: {
      PRIMARY_COLOR: '#4F46E5',
      SECONDARY_COLOR: '#6B7280',
      SUCCESS_COLOR: '#10B981',
      WARNING_COLOR: '#F59E0B',
      ERROR_COLOR: '#EF4444',
    },
    
    PAGINATION: {
      DEFAULT_PAGE_SIZE: 25,
      MAX_PAGE_SIZE: 100,
    },
    
    DASHBOARD: {
      REFRESH_INTERVAL_MS: 30000, // 30 seconds
      CHART_ANIMATION_DURATION: 300,
    },
  },

  // Integration settings
  INTEGRATIONS: {
    PAYMENT_GATEWAYS: ['mpesa', 'stripe', 'paypal'],
    EMAIL_PROVIDERS: ['supabase', 'sendgrid', 'mailgun'],
    STORAGE_PROVIDERS: ['supabase', 'aws-s3', 'cloudinary'],
    ANALYTICS_PROVIDERS: ['internal', 'google-analytics', 'mixpanel'],
  },

  // API Configuration
  API: {
    VERSION: 'v1',
    BASE_PATH: '/api/superadmin',
    RATE_LIMIT: {
      REQUESTS_PER_MINUTE: 100,
      BURST_LIMIT: 200,
    },
  },

  // Audit logging configuration
  AUDIT: {
    RETENTION_DAYS: 365,
    LOG_LEVELS: ['INFO', 'WARN', 'ERROR', 'CRITICAL'],
    TRACKED_ACTIONS: [
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DELETED',
      'TENANT_CREATED',
      'TENANT_UPDATED',
      'TENANT_DELETED',
      'ROLE_ASSIGNED',
      'ROLE_REVOKED',
      'SETTINGS_UPDATED',
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'PASSWORD_CHANGED',
      'SUPERADMIN_CREATED',
    ],
  },
} as const;

/**
 * Get configuration value with environment variable override
 */
export function getConfig<T>(path: string, defaultValue: T): T {
  const envKey = `NEXT_PUBLIC_SUPERADMIN_${path.replace(/\./g, '_').toUpperCase()}`;
  const envValue = process.env[envKey];
  
  if (envValue !== undefined) {
    // Try to parse as JSON for complex types
    try {
      return JSON.parse(envValue);
    } catch {
      // Return as string if not valid JSON
      return envValue as unknown as T;
    }
  }
  
  return defaultValue;
}

/**
 * Get security code from environment or default
 */
export function getSecurityCode(): string {
  return process.env.NEXT_PUBLIC_SUPERADMIN_CODE || SUPERADMIN_CONFIG.SECURITY.DEFAULT_SECURITY_CODE;
}

/**
 * Validate password against security requirements
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const config = SUPERADMIN_CONFIG.SECURITY;

  if (password.length < config.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${config.PASSWORD_MIN_LENGTH} characters long`);
  }

  if (config.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (config.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (config.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (config.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof SUPERADMIN_CONFIG.FEATURES): boolean {
  return getConfig(`FEATURES.${feature}`, SUPERADMIN_CONFIG.FEATURES[feature]);
}

/**
 * Get theme configuration
 */
export function getThemeConfig() {
  return {
    ...SUPERADMIN_CONFIG.UI.THEME,
    primaryColor: getConfig('UI.THEME.PRIMARY_COLOR', SUPERADMIN_CONFIG.UI.THEME.PRIMARY_COLOR),
    secondaryColor: getConfig('UI.THEME.SECONDARY_COLOR', SUPERADMIN_CONFIG.UI.THEME.SECONDARY_COLOR),
  };
}