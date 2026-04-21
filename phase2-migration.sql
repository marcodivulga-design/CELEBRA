-- FASE 2: Migração de Dados - Adicionar organizationId às tabelas existentes

-- 1. Adicionar coluna organizationId (NULLABLE para compatibilidade)
ALTER TABLE celebrations ADD COLUMN IF NOT EXISTS organizationId INT NULLABLE;
ALTER TABLE readings ADD COLUMN IF NOT EXISTS organizationId INT NULLABLE;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS organizationId INT NULLABLE;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS organizationId INT NULLABLE;
ALTER TABLE ministries ADD COLUMN IF NOT EXISTS organizationId INT NULLABLE;

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_celebrations_organizationId ON celebrations(organizationId);
CREATE INDEX IF NOT EXISTS idx_readings_organizationId ON readings(organizationId);
CREATE INDEX IF NOT EXISTS idx_teams_organizationId ON teams(organizationId);
CREATE INDEX IF NOT EXISTS idx_songs_organizationId ON songs(organizationId);
CREATE INDEX IF NOT EXISTS idx_ministries_organizationId ON ministries(organizationId);

-- 3. Criar organização padrão para cada usuário existente
-- Isso permite que dados históricos continuem funcionando
INSERT INTO organizations (name, slug, plan, ownerId)
SELECT 
  CONCAT(u.name, ' - Organização Padrão') as name,
  CONCAT('org-', u.id, '-', UNIX_TIMESTAMP()) as slug,
  'free' as plan,
  u.id as ownerId
FROM users u
WHERE u.id NOT IN (SELECT DISTINCT ownerId FROM organizations)
ON DUPLICATE KEY UPDATE id=id;

-- 4. Adicionar usuários às suas organizações padrão
INSERT INTO organizationUsers (organizationId, userId, role)
SELECT o.id, o.ownerId, 'owner'
FROM organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM organizationUsers ou 
  WHERE ou.organizationId = o.id AND ou.userId = o.ownerId
)
ON DUPLICATE KEY UPDATE id=id;

-- 5. Atualizar dados históricos com organizationId
-- Celebrações: usar organização do usuário que criou
UPDATE celebrations c
SET c.organizationId = (
  SELECT o.id FROM organizations o 
  WHERE o.ownerId = c.createdBy 
  LIMIT 1
)
WHERE c.organizationId IS NULL AND c.createdBy IS NOT NULL;

-- Readings: usar organização da celebração associada
UPDATE readings r
SET r.organizationId = (
  SELECT c.organizationId FROM celebrations c 
  WHERE c.id = r.celebrationId 
  LIMIT 1
)
WHERE r.organizationId IS NULL AND r.celebrationId IS NOT NULL;

-- Teams: usar organização da celebração associada
UPDATE teams t
SET t.organizationId = (
  SELECT c.organizationId FROM celebrations c 
  WHERE c.id = t.celebrationId 
  LIMIT 1
)
WHERE t.organizationId IS NULL AND t.celebrationId IS NOT NULL;

-- 6. Criar subscrição padrão para cada organização
INSERT INTO subscriptions (organizationId, plan, status)
SELECT o.id, o.plan, 'active'
FROM organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions s 
  WHERE s.organizationId = o.id
)
ON DUPLICATE KEY UPDATE id=id;

-- 7. Inicializar rastreamento de uso
INSERT INTO usageTracking (organizationId, feature, count, resetDate)
SELECT 
  o.id,
  pf.feature,
  0,
  CURDATE()
FROM organizations o
CROSS JOIN (
  SELECT DISTINCT feature FROM planFeatures
) pf
WHERE NOT EXISTS (
  SELECT 1 FROM usageTracking ut 
  WHERE ut.organizationId = o.id 
  AND ut.feature = pf.feature 
  AND ut.resetDate = CURDATE()
)
ON DUPLICATE KEY UPDATE id=id;

-- 8. Validar integridade referencial
-- Verificar se há registros órfãos
SELECT 'Celebrações sem organização' as issue, COUNT(*) as count 
FROM celebrations WHERE organizationId IS NULL
UNION ALL
SELECT 'Readings sem organização', COUNT(*) 
FROM readings WHERE organizationId IS NULL
UNION ALL
SELECT 'Teams sem organização', COUNT(*) 
FROM teams WHERE organizationId IS NULL;
