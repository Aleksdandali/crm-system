-- CRM System - Supabase Database Schema
-- Execute this SQL in Supabase SQL Editor

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'sales' CHECK (role IN ('admin', 'manager', 'sales', 'viewer')),
    phone VARCHAR(50),
    avatar VARCHAR(500),
    "isActive" BOOLEAN DEFAULT true,
    "lastLogin" TIMESTAMP,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    website VARCHAR(500),
    industry VARCHAR(100),
    size VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(255),
    address JSONB,
    description TEXT,
    "taxId" VARCHAR(100),
    "ownerId" UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    "customFields" JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    position VARCHAR(100),
    "companyId" UUID REFERENCES companies(id) ON UPDATE CASCADE ON DELETE SET NULL,
    "ownerId" UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'customer', 'inactive')),
    tags TEXT[],
    notes TEXT,
    address JSONB,
    "customFields" JSONB,
    "lastContactDate" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Deals table
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    value DECIMAL(15, 2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'UAH',
    stage VARCHAR(50) DEFAULT 'qualification' CHECK (stage IN ('qualification', 'proposal', 'negotiation', 'closing', 'won', 'lost')),
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    "expectedCloseDate" TIMESTAMP,
    "actualCloseDate" TIMESTAMP,
    "contactId" UUID REFERENCES contacts(id) ON UPDATE CASCADE ON DELETE SET NULL,
    "companyId" UUID REFERENCES companies(id) ON UPDATE CASCADE ON DELETE SET NULL,
    "ownerId" UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    description TEXT,
    "lostReason" VARCHAR(255),
    "customFields" JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    "dueDate" TIMESTAMP,
    "completedAt" TIMESTAMP,
    "assigneeId" UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    "creatorId" UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    "contactId" UUID REFERENCES contacts(id) ON UPDATE CASCADE ON DELETE SET NULL,
    "dealId" UUID REFERENCES deals(id) ON UPDATE CASCADE ON DELETE SET NULL,
    category VARCHAR(100),
    tags TEXT[],
    reminder TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('call', 'meeting', 'email', 'note', 'task', 'deal_update')),
    subject VARCHAR(255),
    description TEXT,
    duration INTEGER,
    outcome VARCHAR(255),
    "userId" UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    "contactId" UUID REFERENCES contacts(id) ON UPDATE CASCADE ON DELETE SET NULL,
    "dealId" UUID REFERENCES deals(id) ON UPDATE CASCADE ON DELETE SET NULL,
    "activityDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Emails table
CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "messageId" VARCHAR(255) UNIQUE,
    "threadId" VARCHAR(255),
    "from" VARCHAR(255) NOT NULL,
    "to" TEXT[] NOT NULL,
    cc TEXT[],
    bcc TEXT[],
    subject VARCHAR(500),
    body TEXT,
    "htmlBody" TEXT,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    status VARCHAR(20) DEFAULT 'received' CHECK (status IN ('draft', 'sent', 'received', 'failed')),
    "contactId" UUID REFERENCES contacts(id) ON UPDATE CASCADE ON DELETE SET NULL,
    "userId" UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    attachments JSONB,
    opened BOOLEAN DEFAULT false,
    "openedAt" TIMESTAMP,
    clicked BOOLEAN DEFAULT false,
    "sentAt" TIMESTAMP,
    "receivedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('dashboard', 'sales', 'contacts', 'custom')),
    configuration JSONB NOT NULL,
    "userId" UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    "isPublic" BOOLEAN DEFAULT false,
    schedule JSONB,
    "lastRun" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('1c', 'shine_shop', 'other')),
    status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
    configuration JSONB NOT NULL,
    "lastSync" TIMESTAMP,
    "lastError" TEXT,
    "syncLog" JSONB,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_owner ON contacts("ownerId");
CREATE INDEX IF NOT EXISTS idx_deals_owner ON deals("ownerId");
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks("assigneeId");
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities("userId");
CREATE INDEX IF NOT EXISTS idx_emails_contact ON emails("contactId");

-- Row Level Security (RLS) - Optional but recommended
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Note: You'll need to create RLS policies based on your auth strategy
-- Example policy (customize as needed):
-- CREATE POLICY "Users can view own data" ON contacts
--   FOR SELECT USING (auth.uid() = "ownerId");
