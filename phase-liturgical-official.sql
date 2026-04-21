-- FASE: Calendário Litúrgico Oficial (NOA) com Ciclos A/B/C e Cores de Estolas

-- 1. Tabela de Ciclos Litúrgicos (A, B, C)
CREATE TABLE IF NOT EXISTS liturgicalCycles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  year INT NOT NULL UNIQUE,
  cycle ENUM('A', 'B', 'C') NOT NULL,
  description VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_year (year),
  INDEX idx_cycle (cycle)
);

-- 2. Tabela de Tempos Litúrgicos com Cores
CREATE TABLE IF NOT EXISTS liturgicalSeasons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE, -- 'advento', 'natal', 'quaresma', 'pascoa', 'pentecostes', 'ordinario'
  colorHex VARCHAR(7) NOT NULL, -- Cor da estola (ex: #9933FF para roxo)
  colorName VARCHAR(50) NOT NULL, -- Nome da cor (roxo, branco, verde, vermelho)
  description TEXT,
  symbolism TEXT, -- Significado da cor
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE KEY uk_name (name),
  INDEX idx_colorHex (colorHex)
);

-- 3. Tabela de Datas Litúrgicas Oficiais (NOA)
CREATE TABLE IF NOT EXISTS liturgicalDatesOfficial (
  id INT PRIMARY KEY AUTO_INCREMENT,
  year INT NOT NULL,
  date DATE NOT NULL,
  seasonId INT NOT NULL,
  cycleId INT NOT NULL,
  sundayName VARCHAR(255) NOT NULL, -- Ex: "Domingo de Ramos", "Primeiro Domingo do Advento"
  massMoment VARCHAR(50), -- 'entrada', 'kyrie', 'gloria', 'salmo', 'evangelho', 'oferenda', 'agnusdei', 'comunhao', 'saida'
  firstReading VARCHAR(255), -- Ex: "Is 50, 4-7"
  secondReading VARCHAR(255), -- Ex: "Fl 2, 6-11"
  gospel VARCHAR(255), -- Ex: "Mt 26, 14 - 27, 66"
  psalm VARCHAR(255), -- Ex: "Sl 22"
  responsorialText TEXT, -- Texto do salmo responsorial
  theme VARCHAR(255), -- Tema do domingo
  notes TEXT, -- Notas adicionais
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (seasonId) REFERENCES liturgicalSeasons(id) ON DELETE CASCADE,
  FOREIGN KEY (cycleId) REFERENCES liturgicalCycles(id) ON DELETE CASCADE,
  UNIQUE KEY uk_year_date (year, date),
  INDEX idx_year (year),
  INDEX idx_date (date),
  INDEX idx_seasonId (seasonId),
  INDEX idx_cycleId (cycleId)
);

-- 4. Tabela de Eventos da Paróquia
CREATE TABLE IF NOT EXISTS parishEvents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  eventType ENUM('missa','festa','retiro','reuniao','formacao','outro') NOT NULL,
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  location VARCHAR(255),
  capacity INT,
  registeredCount INT DEFAULT 0,
  image_url VARCHAR(500),
  createdBy INT NOT NULL,
  status ENUM('draft','published','completed','canceled') DEFAULT 'draft' NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_organizationId (organizationId),
  INDEX idx_startDate (startDate),
  INDEX idx_status (status)
);

-- 5. Tabela de Notícias da Paróquia
CREATE TABLE IF NOT EXISTS parishNews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  image_url VARCHAR(500),
  category VARCHAR(100), -- 'noticia', 'avisos', 'espiritualidade', 'comunidade'
  author INT NOT NULL,
  status ENUM('draft','published','archived') DEFAULT 'draft' NOT NULL,
  viewCount INT DEFAULT 0,
  publishedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (author) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_organizationId (organizationId),
  INDEX idx_status (status),
  INDEX idx_publishedAt (publishedAt),
  FULLTEXT INDEX ft_title_content (title, content)
);

-- 6. Tabela de Comentários em Notícias
CREATE TABLE IF NOT EXISTS newsComments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  newsId INT NOT NULL,
  userId INT NOT NULL,
  content TEXT NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending' NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (newsId) REFERENCES parishNews(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_newsId (newsId),
  INDEX idx_userId (userId),
  INDEX idx_status (status)
);

-- 7. Tabela de Espaço de Interação para Usuários (Comunidade)
CREATE TABLE IF NOT EXISTS communityPosts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  userId INT NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  category VARCHAR(100), -- 'duvida', 'testemunho', 'reflexao', 'pedido_oracao', 'outro'
  image_url VARCHAR(500),
  status ENUM('pending','approved','rejected') DEFAULT 'pending' NOT NULL,
  likeCount INT DEFAULT 0,
  commentCount INT DEFAULT 0,
  viewCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_organizationId (organizationId),
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt),
  FULLTEXT INDEX ft_title_content (title, content)
);

-- 8. Tabela de Comentários em Posts da Comunidade
CREATE TABLE IF NOT EXISTS communityComments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT NOT NULL,
  userId INT NOT NULL,
  content TEXT NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending' NOT NULL,
  likeCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (postId) REFERENCES communityPosts(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_postId (postId),
  INDEX idx_userId (userId),
  INDEX idx_status (status)
);

-- 9. Tabela de Espaço de Coordenação para Padres
CREATE TABLE IF NOT EXISTS priestCoordination (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  priestId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('orientacao','avisos','formacao','reflexao','coordenacao') NOT NULL,
  visibility ENUM('private','priests_only','all') DEFAULT 'priests_only' NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (priestId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_organizationId (organizationId),
  INDEX idx_priestId (priestId),
  INDEX idx_type (type)
);

-- 10. Tabela de Preferências de Notificação
CREATE TABLE IF NOT EXISTS notificationPreferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  organizationId INT NOT NULL,
  newsNotifications BOOLEAN DEFAULT 1,
  eventNotifications BOOLEAN DEFAULT 1,
  communityNotifications BOOLEAN DEFAULT 1,
  priestNotifications BOOLEAN DEFAULT 1,
  scaleNotifications BOOLEAN DEFAULT 1,
  notificationChannel ENUM('in_app','email','whatsapp','sms') DEFAULT 'in_app' NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_organization (userId, organizationId),
  INDEX idx_userId (userId)
);

-- Inserir cores litúrgicas
INSERT INTO liturgicalSeasons (name, colorHex, colorName, description, symbolism) VALUES
('advento', '#9933FF', 'roxo', 'Tempo de preparação para o Natal', 'Penitência, esperança e preparação'),
('natal', '#FFFFFF', 'branco', 'Celebração do nascimento de Jesus', 'Pureza, alegria e luz divina'),
('quaresma', '#9933FF', 'roxo', 'Tempo de penitência e preparação para a Páscoa', 'Conversão, jejum e arrependimento'),
('pascoa', '#FFFFFF', 'branco', 'Celebração da ressurreição de Jesus', 'Ressurreição, vitória e vida eterna'),
('pentecostes', '#FF0000', 'vermelho', 'Celebração do Espírito Santo', 'Fogo divino, amor e martírio'),
('ordinario', '#00AA00', 'verde', 'Tempo ordinário entre celebrações', 'Esperança, crescimento e vida cotidiana');

-- Criar índices adicionais para performance
CREATE INDEX IF NOT EXISTS idx_parishEvents_organizationId ON parishEvents(organizationId);
CREATE INDEX IF NOT EXISTS idx_parishNews_organizationId ON parishNews(organizationId);
CREATE INDEX IF NOT EXISTS idx_communityPosts_organizationId ON communityPosts(organizationId);
CREATE INDEX IF NOT EXISTS idx_priestCoordination_organizationId ON priestCoordination(organizationId);
