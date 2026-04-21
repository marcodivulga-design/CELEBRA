-- ===== CHURCH HIERARCHY TABLES =====

-- Arquidioceses (Archdioceses)
CREATE TABLE IF NOT EXISTS archdioceses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  archbishop VARCHAR(255),
  state VARCHAR(2),
  country VARCHAR(100) DEFAULT 'Brazil',
  website VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photoUrl VARCHAR(500),
  foundedYear INT,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_state (state),
  INDEX idx_name (name)
);

-- Dioceses (Dioceses)
CREATE TABLE IF NOT EXISTS dioceses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  archdiocesesId INT,
  bishop VARCHAR(255),
  state VARCHAR(2),
  website VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photoUrl VARCHAR(500),
  foundedYear INT,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (archdiocesesId) REFERENCES archdioceses(id) ON DELETE CASCADE,
  INDEX idx_archdiocesesId (archdiocesesId),
  INDEX idx_state (state),
  INDEX idx_name (name)
);

-- Paróquias (Parishes)
CREATE TABLE IF NOT EXISTS parishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organizationId INT NOT NULL,
  dioceseId INT,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(2),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photoUrl VARCHAR(500),
  foundedYear INT,
  patronSaint VARCHAR(255),
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dioceseId) REFERENCES dioceses(id) ON DELETE SET NULL,
  INDEX idx_organizationId (organizationId),
  INDEX idx_dioceseId (dioceseId),
  INDEX idx_city (city),
  INDEX idx_state (state)
);

-- Igrejas (Churches)
CREATE TABLE IF NOT EXISTS churches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organizationId INT NOT NULL,
  parishId INT,
  name VARCHAR(255) NOT NULL,
  type ENUM('cathedral', 'church', 'chapel', 'sanctuary', 'basilica') DEFAULT 'church',
  city VARCHAR(255) NOT NULL,
  state VARCHAR(2),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photoUrl VARCHAR(500),
  foundedYear INT,
  patronSaint VARCHAR(255),
  description TEXT,
  capacity INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (parishId) REFERENCES parishes(id) ON DELETE SET NULL,
  INDEX idx_organizationId (organizationId),
  INDEX idx_parishId (parishId),
  INDEX idx_city (city),
  INDEX idx_state (state),
  INDEX idx_type (type)
);

-- Padres (Priests)
CREATE TABLE IF NOT EXISTS priests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  dioceseId INT,
  parishId INT,
  churchId INT,
  role ENUM('bishop', 'archbishop', 'priest', 'deacon', 'vicar', 'chaplain') DEFAULT 'priest',
  ordinationYear INT,
  bio TEXT,
  photoUrl VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dioceseId) REFERENCES dioceses(id) ON DELETE SET NULL,
  FOREIGN KEY (parishId) REFERENCES parishes(id) ON DELETE SET NULL,
  FOREIGN KEY (churchId) REFERENCES churches(id) ON DELETE SET NULL,
  INDEX idx_dioceseId (dioceseId),
  INDEX idx_parishId (parishId),
  INDEX idx_churchId (churchId),
  INDEX idx_role (role)
);

-- Padroeiros (Patrons/Saints)
CREATE TABLE IF NOT EXISTS patrons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  feastDay DATE,
  biography TEXT,
  iconUrl VARCHAR(500),
  dioceseId INT,
  parishId INT,
  churchId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dioceseId) REFERENCES dioceses(id) ON DELETE SET NULL,
  FOREIGN KEY (parishId) REFERENCES parishes(id) ON DELETE SET NULL,
  FOREIGN KEY (churchId) REFERENCES churches(id) ON DELETE SET NULL,
  INDEX idx_dioceseId (dioceseId),
  INDEX idx_parishId (parishId),
  INDEX idx_churchId (churchId)
);

-- Fotos da Igreja (Church Photos)
CREATE TABLE IF NOT EXISTS churchPhotos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  churchId INT NOT NULL,
  photoUrl VARCHAR(500) NOT NULL,
  caption VARCHAR(500),
  isMain BOOLEAN DEFAULT FALSE,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (churchId) REFERENCES churches(id) ON DELETE CASCADE,
  INDEX idx_churchId (churchId),
  INDEX idx_isMain (isMain)
);

-- Contatos da Igreja (Church Contacts)
CREATE TABLE IF NOT EXISTS churchContacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  churchId INT NOT NULL,
  contactType ENUM('pastor', 'vicar', 'secretary', 'music_director', 'maintenance') DEFAULT 'secretary',
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (churchId) REFERENCES churches(id) ON DELETE CASCADE,
  INDEX idx_churchId (churchId),
  INDEX idx_contactType (contactType)
);

-- ===== SAMPLE DATA =====

-- Arquidioceses
INSERT INTO archdioceses (name, archbishop, state, website, phone, email, address, foundedYear, description) VALUES
('Arquidiocese de São Paulo', 'Dom Orani João Tempesta', 'SP', 'www.arqsp.org.br', '(11) 3111-1111', 'contato@arqsp.org.br', 'Av. Paulista, 1000', 1745, 'Arquidiocese Metropolitana de São Paulo'),
('Arquidiocese do Rio de Janeiro', 'Dom Orani João Tempesta', 'RJ', 'www.arqrj.org.br', '(21) 2111-1111', 'contato@arqrj.org.br', 'Rua Rio Branco, 500', 1676, 'Arquidiocese Metropolitana do Rio de Janeiro');

-- Dioceses
INSERT INTO dioceses (name, archdiocesesId, bishop, state, website, phone, email, address, foundedYear, description) VALUES
(1, 'Diocese de São Paulo', 'Dom Orani João Tempesta', 'SP', 'www.diocesesp.org.br', '(11) 3222-2222', 'contato@diocesesp.org.br', 'Av. Paulista, 1000', 1745, 'Diocese de São Paulo'),
(1, 'Diocese de Guarulhos', 'Dom Arnaldo Carvalheiro', 'SP', 'www.dioceseguarulhos.org.br', '(11) 4333-3333', 'contato@dioceseguarulhos.org.br', 'Rua das Flores, 200', 1980, 'Diocese de Guarulhos'),
(2, 'Diocese do Rio de Janeiro', 'Dom Orani João Tempesta', 'RJ', 'www.diocesrj.org.br', '(21) 2222-2222', 'contato@diocesrj.org.br', 'Rua Rio Branco, 500', 1676, 'Diocese do Rio de Janeiro');

-- Paróquias
INSERT INTO parishes (organizationId, dioceseId, name, city, state, address, phone, email, foundedYear, patronSaint, description) VALUES
(1, 1, 'Paróquia da Catedral', 'São Paulo', 'SP', 'Av. Paulista, 1000', '(11) 3111-1111', 'catedral@sp.org.br', 1745, 'Nossa Senhora da Conceição', 'Paróquia da Catedral Metropolitana'),
(1, 1, 'Paróquia de Santo Antônio', 'São Paulo', 'SP', 'Rua Santo Antônio, 500', '(11) 2222-2222', 'santoantonio@sp.org.br', 1850, 'Santo Antônio de Pádua', 'Paróquia de Santo Antônio'),
(1, 2, 'Paróquia de Nossa Senhora Aparecida', 'Guarulhos', 'SP', 'Av. Aparecida, 1500', '(11) 4444-4444', 'aparecida@sp.org.br', 1980, 'Nossa Senhora Aparecida', 'Paróquia de Nossa Senhora Aparecida'),
(1, 3, 'Paróquia de São Jorge', 'Rio de Janeiro', 'RJ', 'Rua São Jorge, 100', '(21) 5555-5555', 'saojorge@rj.org.br', 1900, 'São Jorge', 'Paróquia de São Jorge');

-- Igrejas
INSERT INTO churches (organizationId, parishId, name, type, city, state, address, phone, email, foundedYear, patronSaint, capacity, description) VALUES
(1, 1, 'Catedral Metropolitana', 'cathedral', 'São Paulo', 'SP', 'Av. Paulista, 1000', '(11) 3111-1111', 'catedral@sp.org.br', 1745, 'Nossa Senhora da Conceição', 5000, 'Catedral Metropolitana de São Paulo'),
(1, 2, 'Igreja de Santo Antônio', 'church', 'São Paulo', 'SP', 'Rua Santo Antônio, 500', '(11) 2222-2222', 'santoantonio@sp.org.br', 1850, 'Santo Antônio de Pádua', 800, 'Igreja de Santo Antônio'),
(1, 2, 'Capela de São Benedito', 'chapel', 'São Paulo', 'SP', 'Rua São Benedito, 200', '(11) 1111-1111', 'saobenedito@sp.org.br', 1920, 'São Benedito', 300, 'Capela de São Benedito'),
(1, 3, 'Santuário de Nossa Senhora Aparecida', 'sanctuary', 'Guarulhos', 'SP', 'Av. Aparecida, 1500', '(11) 4444-4444', 'aparecida@sp.org.br', 1980, 'Nossa Senhora Aparecida', 2000, 'Santuário de Nossa Senhora Aparecida'),
(1, 4, 'Igreja de São Jorge', 'church', 'Rio de Janeiro', 'RJ', 'Rua São Jorge, 100', '(21) 5555-5555', 'saojorge@rj.org.br', 1900, 'São Jorge', 600, 'Igreja de São Jorge');

-- Padres
INSERT INTO priests (name, email, phone, parishId, churchId, role, ordinationYear, bio) VALUES
('Dom Orani João Tempesta', 'orani@sp.org.br', '(11) 3111-1111', 1, 1, 'bishop', 1980, 'Arcebispo de São Paulo'),
('Pe. João Silva', 'joao@sp.org.br', '(11) 3111-1112', 1, 1, 'priest', 2010, 'Padre da Catedral'),
('Pe. Carlos Santos', 'carlos@sp.org.br', '(11) 2222-2223', 2, 2, 'priest', 2008, 'Padre de Santo Antônio'),
('Pe. Pedro Oliveira', 'pedro@sp.org.br', '(11) 4444-4445', 3, 4, 'priest', 2012, 'Padre do Santuário'),
('Pe. Marcos Ferreira', 'marcos@rj.org.br', '(21) 5555-5556', 4, 5, 'priest', 2015, 'Padre de São Jorge');

-- Padroeiros
INSERT INTO patrons (name, feastDay, biography, churchId) VALUES
('Nossa Senhora da Conceição', '1985-12-08', 'Padroeira de Portugal e do Brasil', 1),
('Santo Antônio de Pádua', '1985-06-13', 'Padroeiro dos pobres e viajantes', 2),
('São Benedito', '1985-07-11', 'Padroeiro dos músicos', 3),
('Nossa Senhora Aparecida', '1985-10-12', 'Padroeira do Brasil', 4),
('São Jorge', '1985-04-23', 'Padroeiro dos guerreiros', 5);

-- Contatos da Igreja
INSERT INTO churchContacts (churchId, contactType, name, phone, email) VALUES
(1, 'secretary', 'Secretaria da Catedral', '(11) 3111-1113', 'secretaria@catedral.org.br'),
(1, 'music_director', 'Maestro João', '(11) 3111-1114', 'musica@catedral.org.br'),
(2, 'secretary', 'Secretaria de Santo Antônio', '(11) 2222-2224', 'secretaria@santoantonio.org.br'),
(4, 'music_director', 'Maestro Pedro', '(11) 4444-4446', 'musica@aparecida.org.br'),
(5, 'secretary', 'Secretaria de São Jorge', '(21) 5555-5557', 'secretaria@saojorge.org.br');
