-- Tabelas para Mensagens de Áudio do Padre
CREATE TABLE IF NOT EXISTS priestAudioMessages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  priestId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  audioUrl VARCHAR(500) NOT NULL,
  duration INT,
  category ENUM('reflexao', 'homilia', 'bencao', 'ensinamento', 'oracao') DEFAULT 'reflexao',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INT DEFAULT 0,
  FOREIGN KEY (organizationId) REFERENCES organizations(id),
  FOREIGN KEY (priestId) REFERENCES users(id),
  INDEX idx_org (organizationId),
  INDEX idx_priest (priestId),
  INDEX idx_category (category),
  INDEX idx_created (createdAt)
);

CREATE TABLE IF NOT EXISTS priestAudioComments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  audioId INT NOT NULL,
  userId INT NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (audioId) REFERENCES priestAudioMessages(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_audio (audioId),
  INDEX idx_user (userId)
);

-- Tabelas para Blog Católico
CREATE TABLE IF NOT EXISTS catholicBlogPosts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  organizationId INT NOT NULL,
  authorId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(100),
  tags VARCHAR(500),
  featuredImageUrl VARCHAR(500),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  views INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  publishedAt TIMESTAMP NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizationId) REFERENCES organizations(id),
  FOREIGN KEY (authorId) REFERENCES users(id),
  INDEX idx_org (organizationId),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_created (createdAt)
);

CREATE TABLE IF NOT EXISTS catholicBlogComments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT NOT NULL,
  userId INT NOT NULL,
  content TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES catholicBlogPosts(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_post (postId),
  INDEX idx_user (userId),
  INDEX idx_status (status)
);

-- Tabelas para Calendário de Santos
CREATE TABLE IF NOT EXISTS catholicSaints (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  month INT NOT NULL,
  day INT NOT NULL,
  description TEXT,
  biography LONGTEXT,
  imageUrl VARCHAR(500),
  feast_day_type ENUM('major', 'minor', 'optional', 'memorial') DEFAULT 'optional',
  liturgicalColor VARCHAR(50),
  patronOf VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_month (month),
  INDEX idx_day (day),
  INDEX idx_type (feast_day_type)
);

CREATE TABLE IF NOT EXISTS saintSuggestions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  saintId INT NOT NULL,
  organizationId INT NOT NULL,
  suggestedSongId INT,
  suggestedSongTitle VARCHAR(255),
  suggestedSongArtist VARCHAR(255),
  reason TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (saintId) REFERENCES catholicSaints(id),
  FOREIGN KEY (organizationId) REFERENCES organizations(id),
  FOREIGN KEY (suggestedSongId) REFERENCES songs(id),
  INDEX idx_saint (saintId),
  INDEX idx_org (organizationId)
);

-- Inserir alguns santos católicos famosos
INSERT INTO catholicSaints (name, month, day, description, feast_day_type, liturgicalColor, patronOf) VALUES
('Santo Antônio de Pádua', 6, 13, 'Santo Antônio é conhecido como o Santo dos Milagres e protetor dos pobres', 'major', 'vermelho', 'Pobres, viajantes, animais'),
('São João Batista', 6, 24, 'Precursor de Jesus Cristo, batizou Jesus no Rio Jordão', 'major', 'branco', 'Batismo, penitentes'),
('São Pedro', 6, 29, 'Apóstolo de Jesus, primeiro Papa da Igreja Católica', 'major', 'vermelho', 'Papas, Igreja Católica'),
('São Paulo', 6, 29, 'Apóstolo de Jesus, missionário e escritor de epístolas', 'major', 'vermelho', 'Teólogos, missionários'),
('Santa Maria Madalena', 7, 22, 'Discípula de Jesus, primeira testemunha da Ressurreição', 'major', 'branco', 'Penitentes, mulheres'),
('São Tiago Maior', 7, 25, 'Apóstolo de Jesus, primeiro mártir entre os apóstolos', 'major', 'vermelho', 'Espanha, cavaleiros'),
('Santa Ana', 7, 26, 'Mãe de Maria, avó de Jesus', 'major', 'branco', 'Mães, avós'),
('São Lourenço', 8, 10, 'Diácono e mártir da Igreja Primitiva', 'major', 'vermelho', 'Cozinheiros, pobres'),
('Assunção de Maria', 8, 15, 'Festa da subida de Maria aos céus', 'major', 'branco', 'Mulheres, maternidade'),
('São Bartolomeu', 8, 24, 'Apóstolo de Jesus, missionário na Ásia', 'major', 'vermelho', 'Encadernadores, curtidores'),
('São Miguel Arcanjo', 9, 29, 'Arcanjo protetor contra o mal', 'major', 'branco', 'Polícia, militares, segurança'),
('São Francisco de Assis', 10, 4, 'Fundador da Ordem Franciscana, santo da natureza', 'major', 'verde', 'Animais, ecologia, pobres'),
('Santo Inácio de Loyola', 7, 31, 'Fundador da Companhia de Jesus (Jesuítas)', 'major', 'branco', 'Soldados, jesuítas'),
('Santa Teresinha do Menino Jesus', 10, 1, 'Doutora da Igreja, missionária carmelita', 'major', 'branco', 'Missionários, flores'),
('Santa Edith Stein', 8, 9, 'Filósofa e mártir, padroeira da Europa', 'major', 'vermelho', 'Filósofos, intelectuais'),
('São Bento', 7, 11, 'Fundador do Mosteiro de Monte Cassino, pai do monacato ocidental', 'major', 'branco', 'Monges, engenheiros'),
('Santa Joana de Arco', 5, 30, 'Heroína francesa, mártir e santa', 'major', 'branco', 'Soldados, França'),
('Santo Agostinho', 8, 28, 'Doutor da Igreja, filósofo e teólogo', 'major', 'branco', 'Teólogos, impressores'),
('São Jerônimo', 9, 30, 'Doutor da Igreja, tradutor da Bíblia', 'major', 'branco', 'Tradutores, estudiosos'),
('Santa Catarina de Sena', 4, 29, 'Doutora da Igreja, mística italiana', 'major', 'branco', 'Itália, enfermeiras');
