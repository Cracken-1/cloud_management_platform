-- =====================================================
-- INFINITYSTACK ENTERPRISE PLATFORM - DATABASE SCHEMA V2
-- Multi-stage access request system with enhanced security
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Organizations/Tenants
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100),
    website_url VARCHAR(500),
    
    -- Subscription details
    plan_type VARCHAR(50) DEFAULT 'starter', -- starter, professional, enterprise
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, cancelled
    
    -- Limits and quotas
    user_limit INTEGER DEFAULT 10,
    storage_limit_gb INTEGER DEFAULT 5,
    api_calls_limit INTEGER DEFAULT 10000,
    
    -- Configuration
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Users with enhanced profile
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    
    -- Role and permissions
    role VARCHAR(50) NOT NULL DEFAULT 'USER', -- SUPERADMIN, ORG_ADMIN, USER
    organization_id UUID REFERENCES organizations(id),
    
    -- Profile details
    avatar_url VARCHAR(500),
    phone_number VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    
    -- Status and verification
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
    is_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    preferences JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_by UUID
);

-- Multi-stage access requests
CREATE TABLE access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Requester information
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    job_title VARCHAR(100),
    
    -- Organization information
    organization_name VARCHAR(255) NOT NULL,
    organization_domain VARCHAR(255),
    organization_size VARCHAR(50), -- 1-10, 11-50, 51-200, 201-1000, 1000+
    industry VARCHAR(100),
    
    -- Business details
    business_description TEXT,
    use_case TEXT NOT NULL,
    expected_users INTEGER,
    technical_requirements TEXT,
    
    -- Request details
    requested_plan VARCHAR(50) DEFAULT 'starter',
    urgency VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Multi-stage workflow
    stage VARCHAR(50) DEFAULT 'submitted', -- submitted, initial_review, technical_review, business_review, approved, rejected
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    
    -- Review process
    initial_reviewer_id UUID REFERENCES users(id),
    initial_review_notes TEXT,
    initial_reviewed_at TIMESTAMP WITH TIME ZONE,
    
    technical_reviewer_id UUID REFERENCES users(id),
    technical_review_notes TEXT,
    technical_reviewed_at TIMESTAMP WITH TIME ZONE,
    
    business_reviewer_id UUID REFERENCES users(id),
    business_review_notes TEXT,
    business_reviewed_at TIMESTAMP WITH TIME ZONE,
    
    final_approver_id UUID REFERENCES users(id),
    final_approval_notes TEXT,
    final_approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Rejection details
    rejection_reason TEXT,
    rejected_by UUID REFERENCES users(id),
    rejected_at TIMESTAMP WITH TIME ZONE,
    
    -- Assignment details (after approval)
    assigned_organization_id UUID REFERENCES organizations(id),
    assigned_plan VARCHAR(50),
    
    -- Metadata
    source VARCHAR(100) DEFAULT 'web', -- web, api, referral
    referral_code VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access request workflow stages
CREATE TABLE access_request_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES access_requests(id) ON DELETE CASCADE,
    
    stage VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL, -- pending, in_progress, completed, skipped
    
    assigned_to UUID REFERENCES users(id),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for all system activities
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Context
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    
    -- Action details
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    
    -- Request details
    ip_address INET,
    user_agent TEXT,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    
    -- Additional context
    details TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Target
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    
    -- Content
    type VARCHAR(50) NOT NULL, -- info, success, warning, error, access_request
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Delivery
    channels JSONB DEFAULT '["in_app"]', -- in_app, email, sms
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Actions
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Expiry
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Organizations
CREATE INDEX idx_organizations_domain ON organizations(domain);
CREATE INDEX idx_organizations_status ON organizations(status);

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Access requests
CREATE INDEX idx_access_requests_email ON access_requests(email);
CREATE INDEX idx_access_requests_stage ON access_requests(stage);
CREATE INDEX idx_access_requests_status ON access_requests(status);
CREATE INDEX idx_access_requests_created ON access_requests(created_at);

-- Audit logs
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_request_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Superadmin policies (full access)
CREATE POLICY "superadmin_all_organizations" ON organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'SUPERADMIN'
        )
    );

CREATE POLICY "superadmin_all_users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid() 
            AND u.role = 'SUPERADMIN'
        )
    );

CREATE POLICY "superadmin_all_access_requests" ON access_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'SUPERADMIN'
        )
    );

-- Organization admin policies
CREATE POLICY "org_admin_users" ON users
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM users 
            WHERE id = auth.uid() 
            AND role IN ('ORG_ADMIN', 'SUPERADMIN')
        )
        OR id = auth.uid()
    );

-- User self-access policies
CREATE POLICY "users_own_profile" ON users
    FOR SELECT USING (id = auth.uid());

-- Access request policies
CREATE POLICY "access_requests_reviewers" ON access_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('SUPERADMIN', 'ORG_ADMIN')
        )
    );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_access_requests_updated_at 
    BEFORE UPDATE ON access_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Audit logging function
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        organization_id,
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values
    ) VALUES (
        COALESCE(NEW.organization_id, OLD.organization_id),
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id::text, OLD.id::text),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers
CREATE TRIGGER audit_organizations 
    AFTER INSERT OR UPDATE OR DELETE ON organizations 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_users 
    AFTER INSERT OR UPDATE OR DELETE ON users 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_access_requests 
    AFTER INSERT OR UPDATE OR DELETE ON access_requests 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Create system organization for superadmins
INSERT INTO organizations (
    id,
    name,
    domain,
    plan_type,
    status,
    user_limit,
    storage_limit_gb,
    api_calls_limit
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'InfinityStack System',
    'system.infinitystack.com',
    'enterprise',
    'active',
    999999,
    999999,
    999999999
) ON CONFLICT (id) DO NOTHING;

-- Note: Superadmin users should be created through the application
-- with proper email verification and security checks