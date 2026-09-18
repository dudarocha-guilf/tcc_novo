CREATE DATABASE IF NOT EXISTS letrika_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE letrika_db;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nome_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT 'default-avatar.png',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de jogos
CREATE TABLE IF NOT EXISTS jogos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) NOT NULL,
    ativo TINYINT(1) DEFAULT 1
);

-- Tabela de pontuações
CREATE TABLE IF NOT EXISTS pontuacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    jogo_id INT NOT NULL,
    pontuacao INT NOT NULL DEFAULT 0,
    data_partida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pontuacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_pontuacoes_jogo FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_jogo_id (jogo_id)
);

-- Tabela de perguntas do quiz
CREATE TABLE IF NOT EXISTS perguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jogo_id INT NOT NULL,
    palavra VARCHAR(100) NOT NULL,
    pergunta TEXT NOT NULL,
    alternativa_a VARCHAR(255) NOT NULL,
    alternativa_b VARCHAR(255) NOT NULL,
    alternativa_c VARCHAR(255) NOT NULL,
    resposta_correta ENUM('A', 'B', 'C') NOT NULL,
    explicacao TEXT,
    dificuldade ENUM('facil', 'medio', 'dificil') DEFAULT 'facil',
    ativo TINYINT(1) DEFAULT 1,
    CONSTRAINT fk_perguntas_jogo FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
    INDEX idx_perguntas_jogo (jogo_id)
);

-- Tabela de palavras do jogo de corrida
CREATE TABLE IF NOT EXISTS palavras_corrida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    palavra_incorreta VARCHAR(100) NOT NULL,
    palavra_correta VARCHAR(100) NOT NULL,
    alternativa_a VARCHAR(100) NOT NULL,
    alternativa_b VARCHAR(100) NOT NULL,
    resposta_correta ENUM('A', 'B') NOT NULL,
    acao VARCHAR(50) NOT NULL,
    dificuldade ENUM('facil', 'medio', 'dificil') DEFAULT 'facil',
    ativo TINYINT(1) DEFAULT 1,
    UNIQUE KEY uq_palavra_corrida (palavra_incorreta, palavra_correta)
);

-- Roupinhas conquistadas pelos usuários
CREATE TABLE IF NOT EXISTS roupinhas_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    emoji VARCHAR(20) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    equipada TINYINT(1) DEFAULT 0,
    data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_roupinhas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY uq_roupinha_usuario (usuario_id, emoji),
    INDEX idx_roupinhas_usuario (usuario_id)
);

-- Inserção inicial dos jogos
INSERT INTO jogos (nome, descricao, tipo, ativo)
VALUES
('Corrida de Acentos', 'Corrida de palavras com acentos e regras da língua portuguesa.', 'corrida', 1),
('Quiz de Acentuação e Sílabas', 'Pratique acentuação, sílaba tônica, escrita correta e separação silábica.', 'quiz', 1)
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- Exemplo de perguntas do quiz
INSERT INTO perguntas (jogo_id, palavra, pergunta, alternativa_a, alternativa_b, alternativa_c, resposta_correta, explicacao, dificuldade, ativo)
VALUES
(2, 'café', 'Qual é a classificação da palavra “café”?', 'Oxítona', 'Paroxítona', 'Proparoxítona', 'A', 'A palavra café tem a sílaba tônica na última sílaba: café.', 'facil', 1),
(2, 'mesa', 'Qual é a classificação da palavra “mesa”?', 'Oxítona', 'Paroxítona', 'Proparoxítona', 'B', 'A palavra mesa tem a sílaba tônica na penúltima sílaba: me-sa.', 'facil', 1),
(2, 'música', 'Qual é a classificação da palavra “música”?', 'Oxítona', 'Paroxítona', 'Proparoxítona', 'C', 'A palavra música tem a sílaba tônica na antepenúltima sílaba: mú-si-ca.', 'facil', 1)
ON DUPLICATE KEY UPDATE palavra = VALUES(palavra);

-- Exemplo de palavras para a corrida de acentos
INSERT INTO palavras_corrida (palavra_incorreta, palavra_correta, alternativa_a, alternativa_b, resposta_correta, acao, dificuldade, ativo)
VALUES
('cafe', 'café', 'cafe', 'café', 'B', 'pular', 'facil', 1),
('voce', 'você', 'você', 'voce', 'A', 'agachar', 'facil', 1),
('arvore', 'árvore', 'árvore', 'arvore', 'A', 'desviar', 'medio', 1),
('lapis', 'lápis', 'lapis', 'lápis', 'B', 'continuar', 'medio', 1),
('portugues', 'português', 'português', 'portugues', 'A', 'avancar', 'dificil', 1)
ON DUPLICATE KEY UPDATE palavra_correta = VALUES(palavra_correta);

-- Visualização útil dos dados
SELECT 'Banco de dados e tabelas criados com sucesso!' AS status;
