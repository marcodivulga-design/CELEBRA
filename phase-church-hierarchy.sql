-- Fase 1: Tabelas de Hierarquia Religiosa
-- Estrutura: Arquidiocese → Diocese → Paróquia → Igreja/Capela

CREATE TABLE IF NOT EXISTS archdioceses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  state VARCHAR(50),
  city VARCHAR(100),
  founded_year INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dioceses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  archdiocese_id INT,
  state VARCHAR(50),
  city VARCHAR(100),
  founded_year INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (archdiocese_id) REFERENCES archdioceses(id)
);

CREATE TABLE IF NOT EXISTS parishes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  diocese_id INT,
  organization_id INT,
  state VARCHAR(50),
  city VARCHAR(100),
  address VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(255),
  founded_year INT,
  patron_saint VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (diocese_id) REFERENCES dioceses(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS churches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  parish_id INT,
  organization_id INT,
  type ENUM('cathedral', 'church', 'chapel', 'sanctuary', 'basilica') DEFAULT 'church',
  state VARCHAR(50),
  city VARCHAR(100),
  address VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  founded_year INT,
  patron_saint VARCHAR(100),
  description TEXT,
  photo_url VARCHAR(500),
  capacity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parish_id) REFERENCES parishes(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  INDEX idx_organization_id (organization_id),
  INDEX idx_city (city),
  INDEX idx_state (state)
);

CREATE TABLE IF NOT EXISTS church_photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  church_id INT,
  photo_url VARCHAR(500),
  caption VARCHAR(255),
  is_main BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS priests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  diocese_id INT,
  parish_id INT,
  church_id INT,
  role ENUM('bishop', 'archbishop', 'priest', 'deacon', 'vicar', 'chaplain') DEFAULT 'priest',
  ordination_year INT,
  bio TEXT,
  photo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (diocese_id) REFERENCES dioceses(id),
  FOREIGN KEY (parish_id) REFERENCES parishes(id),
  FOREIGN KEY (church_id) REFERENCES churches(id)
);

CREATE TABLE IF NOT EXISTS patrons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  feast_day DATE,
  biography TEXT,
  icon_url VARCHAR(500),
  diocese_id INT,
  parish_id INT,
  church_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (diocese_id) REFERENCES dioceses(id),
  FOREIGN KEY (parish_id) REFERENCES parishes(id),
  FOREIGN KEY (church_id) REFERENCES churches(id)
);

CREATE TABLE IF NOT EXISTS church_contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  church_id INT,
  contact_type ENUM('pastor', 'vicar', 'secretary', 'music_director', 'maintenance') DEFAULT 'pastor',
  name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE
);

-- Inserir algumas Arquidioceses de exemplo
INSERT INTO archdioceses (name, region, state, city, founded_year, description) VALUES
('Arquidiocese de São Paulo', 'Sudeste', 'SP', 'São Paulo', 1745, 'Uma das maiores arquidioceses do Brasil'),
('Arquidiocese de Brasília', 'Centro-Oeste', 'DF', 'Brasília', 1960, 'Arquidiocese da capital federal'),
('Arquidiocese de Salvador', 'Nordeste', 'BA', 'Salvador', 1551, 'Uma das mais antigas do Brasil');

-- Inserir algumas Dioceses de exemplo
INSERT INTO dioceses (name, archdiocese_id, state, city, founded_year, description) VALUES
('Diocese de Santo André', 1, 'SP', 'Santo André', 1954, 'Diocese da Região do ABC'),
('Diocese de Brasília', 2, 'DF', 'Brasília', 1960, 'Diocese de Brasília'),
('Diocese de Feira de Santana', 3, 'BA', 'Feira de Santana', 1982, 'Diocese do interior baiano');

-- Criar índices para melhor performance
CREATE INDEX idx_parishes_diocese ON parishes(diocese_id);
CREATE INDEX idx_parishes_organization ON parishes(organization_id);
CREATE INDEX idx_churches_parish ON churches(parish_id);
CREATE INDEX idx_priests_diocese ON priests(diocese_id);
CREATE INDEX idx_priests_parish ON priests(parish_id);
CREATE INDEX idx_priests_church ON priests(church_id);
