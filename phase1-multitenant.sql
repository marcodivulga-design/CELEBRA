-- FASE 1: Criar Tabelas Multi-Tenant (Sem alterar tabelas existentes)

-- 1. Tabela de Organizações (Paróquias/Igrejas)
CREATE TABLE IF NOT EXISTS organizations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  plan ENUM('free','pro','enterprise') DEFAULT 'free' NOT NULL,
  ownerId INT NOT NULL,
  logo VARCHAR(255),
  website VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ownerId (ownerId),
  INDEX idx_slug (slug)
);

-- 2. Tabela de Usuários por Organização
CREATE TABLE IF NOT EXISTS organizationUsers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  userId INT NOT NULL,
  role ENUM('owner','admin','member') DEFAULT 'member' NOT NULL,
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_organization_user (organizationId, userId),
  INDEX idx_organizationId (organizationId),
  INDEX idx_userId (userId)
);

-- 3. Tabela de Planos e Feature Flags
CREATE TABLE IF NOT EXISTS planFeatures (
  id INT PRIMARY KEY AUTO_INCREMENT,
  plan ENUM('free','pro','enterprise') NOT NULL,
  feature VARCHAR(100) NOT NULL,
  featureLimit INT,
  enabled BOOLEAN DEFAULT true NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE KEY uk_plan_feature (plan, feature),
  INDEX idx_plan (plan)
);

-- 4. Tabela de Rastreamento de Uso
CREATE TABLE IF NOT EXISTS usageTracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  feature VARCHAR(100) NOT NULL,
  count INT DEFAULT 0 NOT NULL,
  resetDate DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE KEY uk_organization_feature_date (organizationId, feature, resetDate),
  INDEX idx_organizationId (organizationId),
  INDEX idx_resetDate (resetDate)
);

-- 5. Tabela de Planos de Assinatura (para Stripe)
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  stripeSubscriptionId VARCHAR(255) UNIQUE,
  stripeCustomerId VARCHAR(255),
  plan ENUM('free','pro','enterprise') DEFAULT 'free' NOT NULL,
  status ENUM('active','past_due','canceled','unpaid') DEFAULT 'active' NOT NULL,
  currentPeriodStart TIMESTAMP,
  currentPeriodEnd TIMESTAMP,
  canceledAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE KEY uk_organizationId (organizationId),
  INDEX idx_stripeSubscriptionId (stripeSubscriptionId),
  INDEX idx_stripeCustomerId (stripeCustomerId)
);

-- Inserir feature flags padrão
INSERT IGNORE INTO planFeatures (plan, feature, featureLimit, enabled) VALUES
-- FREE PLAN
('free', 'celebrations', 10, true),
('free', 'members', 5, true),
('free', 'teams', 1, true),
('free', 'pdf_export', NULL, true),
('free', 'liturgical_calendar', NULL, false),
('free', 'auto_suggestions', NULL, false),
('free', 'spotify_integration', NULL, false),
('free', 'custom_api', NULL, false),

-- PRO PLAN
('pro', 'celebrations', 100, true),
('pro', 'members', 20, true),
('pro', 'teams', 5, true),
('pro', 'pdf_export', NULL, true),
('pro', 'liturgical_calendar', NULL, true),
('pro', 'auto_suggestions', NULL, true),
('pro', 'spotify_integration', NULL, true),
('pro', 'custom_api', NULL, false),

-- ENTERPRISE PLAN
('enterprise', 'celebrations', NULL, true),
('enterprise', 'members', NULL, true),
('enterprise', 'teams', NULL, true),
('enterprise', 'pdf_export', NULL, true),
('enterprise', 'liturgical_calendar', NULL, true),
('enterprise', 'auto_suggestions', NULL, true),
('enterprise', 'spotify_integration', NULL, true),
('enterprise', 'custom_api', NULL, true);

-- Criar índices adicionais para performance
CREATE INDEX IF NOT EXISTS idx_organizations_plan ON organizations(plan);
CREATE INDEX IF NOT EXISTS idx_organizationUsers_role ON organizationUsers(role);
