-- Tabelas para Chat de Repertório
CREATE TABLE IF NOT EXISTS chatRooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('repertorio', 'geral', 'musicos', 'padres') DEFAULT 'geral',
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizationId) REFERENCES organizations(id),
  FOREIGN KEY (createdBy) REFERENCES users(id),
  INDEX idx_org (organizationId),
  INDEX idx_type (type)
);

CREATE TABLE IF NOT EXISTS chatMessages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  roomId INT NOT NULL,
  userId INT NOT NULL,
  content TEXT NOT NULL,
  attachmentUrl VARCHAR(500),
  attachmentType ENUM('image', 'audio', 'video', 'document', 'music'),
  musicId INT,
  likes INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (roomId) REFERENCES chatRooms(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (musicId) REFERENCES songs(id),
  INDEX idx_room (roomId),
  INDEX idx_user (userId),
  INDEX idx_created (createdAt)
);

CREATE TABLE IF NOT EXISTS chatMessageReactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  messageId INT NOT NULL,
  userId INT NOT NULL,
  reaction VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (messageId) REFERENCES chatMessages(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id),
  UNIQUE KEY unique_reaction (messageId, userId, reaction),
  INDEX idx_message (messageId)
);

-- Tabelas para Sugestões de Músicas
CREATE TABLE IF NOT EXISTS musicSuggestions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  suggestedBy INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  genre VARCHAR(100),
  liturgicalMoment VARCHAR(100),
  reason TEXT,
  youtubeUrl VARCHAR(500),
  spotifyUrl VARCHAR(500),
  status ENUM('pendente', 'aprovada', 'rejeitada') DEFAULT 'pendente',
  approvedBy INT,
  rejectionReason TEXT,
  votes INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approvedAt TIMESTAMP NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id),
  FOREIGN KEY (suggestedBy) REFERENCES users(id),
  FOREIGN KEY (approvedBy) REFERENCES users(id),
  INDEX idx_org (organizationId),
  INDEX idx_status (status),
  INDEX idx_created (createdAt)
);

CREATE TABLE IF NOT EXISTS suggestionVotes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  suggestionId INT NOT NULL,
  userId INT NOT NULL,
  voteType ENUM('up', 'down') DEFAULT 'up',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (suggestionId) REFERENCES musicSuggestions(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id),
  UNIQUE KEY unique_vote (suggestionId, userId),
  INDEX idx_suggestion (suggestionId)
);

-- Tabelas para Espaço Privado de Padres/Bispos
CREATE TABLE IF NOT EXISTS priestSpace (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category ENUM('orientacao', 'formacao', 'reflexao', 'coordenacao', 'avisos') DEFAULT 'orientacao',
  visibility ENUM('padres', 'bispos', 'admin') DEFAULT 'padres',
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizationId) REFERENCES organizations(id),
  FOREIGN KEY (createdBy) REFERENCES users(id),
  INDEX idx_org (organizationId),
  INDEX idx_visibility (visibility),
  INDEX idx_category (category)
);

CREATE TABLE IF NOT EXISTS priestSpaceComments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT NOT NULL,
  userId INT NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES priestSpace(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_post (postId),
  INDEX idx_user (userId)
);

-- Tabelas para Controle de Acesso por Role
CREATE TABLE IF NOT EXISTS rolePermissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('user', 'musico', 'padre', 'bispo', 'admin') NOT NULL,
  permission VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_role_permission (role, permission),
  INDEX idx_role (role)
);

-- Inserir permissões padrão
INSERT INTO rolePermissions (role, permission) VALUES
-- User (fiéis)
('user', 'view_catalog'),
('user', 'view_celebrations'),
('user', 'view_community'),
('user', 'chat_geral'),
('user', 'suggest_music'),
('user', 'view_news'),

-- Musico
('musico', 'view_catalog'),
('musico', 'view_celebrations'),
('musico', 'view_community'),
('musico', 'chat_geral'),
('musico', 'chat_musicos'),
('musico', 'suggest_music'),
('musico', 'view_news'),
('musico', 'view_scales'),

-- Padre
('padre', 'view_catalog'),
('padre', 'view_celebrations'),
('padre', 'manage_celebrations'),
('padre', 'view_community'),
('padre', 'chat_geral'),
('padre', 'chat_musicos'),
('padre', 'chat_padres'),
('padre', 'manage_news'),
('padre', 'approve_suggestions'),
('padre', 'manage_scales'),
('padre', 'view_priest_space'),
('padre', 'manage_priest_space'),

-- Bispo
('bispo', 'view_catalog'),
('bispo', 'view_celebrations'),
('bispo', 'manage_celebrations'),
('bispo', 'view_community'),
('bispo', 'chat_geral'),
('bispo', 'chat_musicos'),
('bispo', 'chat_padres'),
('bispo', 'manage_news'),
('bispo', 'approve_suggestions'),
('bispo', 'manage_scales'),
('bispo', 'view_priest_space'),
('bispo', 'manage_priest_space'),
('bispo', 'manage_organization'),

-- Admin
('admin', '*');
