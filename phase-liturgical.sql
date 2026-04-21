-- FASE: Calendário Litúrgico e Sistema de Escalas

-- 1. Tabela de Datas Litúrgicas (Calendário)
CREATE TABLE IF NOT EXISTS liturgicalDates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  date DATE NOT NULL,
  liturgicalTime VARCHAR(50) NOT NULL, -- 'advento', 'natal', 'quaresma', 'pascoa', 'pentecostes', 'ordinario'
  massMoment VARCHAR(50) NOT NULL, -- 'entrada', 'kyrie', 'gloria', 'salmo', 'evangelho', 'oferenda', 'agnusdei', 'comunhao', 'saida'
  title VARCHAR(255) NOT NULL, -- Ex: "Domingo de Ramos", "Sexta-feira Santa"
  description TEXT,
  suggestedSongs INT DEFAULT 3, -- Número de sugestões de músicas
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE KEY uk_organization_date (organizationId, date),
  INDEX idx_organizationId (organizationId),
  INDEX idx_date (date),
  INDEX idx_liturgicalTime (liturgicalTime)
);

-- 2. Tabela de Sugestões de Músicas por Data Litúrgica
CREATE TABLE IF NOT EXISTS songSuggestions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  liturgicalDateId INT NOT NULL,
  songId INT NOT NULL,
  priority INT DEFAULT 1, -- 1 = mais recomendado, 3 = menos recomendado
  reason VARCHAR(255), -- Ex: "Apropriada para Quaresma", "Tradicional para Páscoa"
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (liturgicalDateId) REFERENCES liturgicalDates(id) ON DELETE CASCADE,
  FOREIGN KEY (songId) REFERENCES songs(id) ON DELETE CASCADE,
  UNIQUE KEY uk_liturgical_song (liturgicalDateId, songId),
  INDEX idx_organizationId (organizationId),
  INDEX idx_priority (priority)
);

-- 3. Tabela de Escalas (Agendamento de Ministérios)
CREATE TABLE IF NOT EXISTS scales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  celebrationId INT NOT NULL,
  name VARCHAR(255) NOT NULL, -- Ex: "Escala de Música - Domingo 14/04"
  description TEXT,
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  status ENUM('draft','published','completed','canceled') DEFAULT 'draft' NOT NULL,
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (celebrationId) REFERENCES celebrations(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_organizationId (organizationId),
  INDEX idx_celebrationId (celebrationId),
  INDEX idx_startDate (startDate),
  INDEX idx_status (status)
);

-- 4. Tabela de Posições/Funções na Escala
CREATE TABLE IF NOT EXISTS scalePositions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  scaleId INT NOT NULL,
  position VARCHAR(100) NOT NULL, -- Ex: "Cantor", "Violão", "Teclado", "Leitor", "Acólito"
  description TEXT,
  requiredMembers INT DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (scaleId) REFERENCES scales(id) ON DELETE CASCADE,
  UNIQUE KEY uk_scale_position (scaleId, position),
  INDEX idx_scaleId (scaleId)
);

-- 5. Tabela de Atribuições na Escala
CREATE TABLE IF NOT EXISTS scaleAssignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  scalePositionId INT NOT NULL,
  userId INT NOT NULL,
  status ENUM('pending','accepted','rejected','completed') DEFAULT 'pending' NOT NULL,
  confirmedAt TIMESTAMP NULL,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (scalePositionId) REFERENCES scalePositions(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_position_user (scalePositionId, userId),
  INDEX idx_userId (userId),
  INDEX idx_status (status)
);

-- 6. Tabela de Notificações de Escala
CREATE TABLE IF NOT EXISTS scaleNotifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  scaleAssignmentId INT NOT NULL,
  userId INT NOT NULL,
  type ENUM('invitation','reminder','change','canceled') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  channel ENUM('email','whatsapp','in_app') DEFAULT 'in_app' NOT NULL,
  sentAt TIMESTAMP NULL,
  readAt TIMESTAMP NULL,
  status ENUM('pending','sent','failed') DEFAULT 'pending' NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (scaleAssignmentId) REFERENCES scaleAssignments(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_channel (channel)
);

-- 7. Tabela de Histórico de Escalas (para relatórios)
CREATE TABLE IF NOT EXISTS scaleHistory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  scaleId INT NOT NULL,
  action VARCHAR(100) NOT NULL, -- 'created', 'published', 'completed', 'canceled'
  changedBy INT NOT NULL,
  oldValues JSON,
  newValues JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (scaleId) REFERENCES scales(id) ON DELETE CASCADE,
  FOREIGN KEY (changedBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_scaleId (scaleId),
  INDEX idx_createdAt (createdAt)
);

-- 8. Tabela de Preferências de Ministério (para sugestões inteligentes)
CREATE TABLE IF NOT EXISTS ministryPreferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  userId INT NOT NULL,
  position VARCHAR(100) NOT NULL, -- Ex: "Cantor", "Violão"
  skill_level ENUM('beginner','intermediate','advanced') DEFAULT 'intermediate' NOT NULL,
  availability JSON, -- {"monday": ["09:00-12:00", "19:00-21:00"], "sunday": ["08:00-12:00"]}
  preferences TEXT, -- Preferências de músicas, horários, etc
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_organization_user_position (organizationId, userId, position),
  INDEX idx_organizationId (organizationId),
  INDEX idx_userId (userId)
);

-- Criar índices adicionais para performance
CREATE INDEX IF NOT EXISTS idx_liturgicalDates_liturgicalTime ON liturgicalDates(liturgicalTime);
CREATE INDEX IF NOT EXISTS idx_scales_status ON scales(status);
CREATE INDEX IF NOT EXISTS idx_scaleAssignments_userId_status ON scaleAssignments(userId, status);
