USE letrika_db;

SET @perfil_existe = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'perfil'
);
SET @sql_perfil = IF(
    @perfil_existe = 0,
    "ALTER TABLE usuarios ADD COLUMN perfil ENUM('aluno', 'professor') NOT NULL DEFAULT 'aluno' AFTER senha",
    'SELECT 1'
);
PREPARE migracao_perfil FROM @sql_perfil;
EXECUTE migracao_perfil;
DEALLOCATE PREPARE migracao_perfil;

CREATE TABLE IF NOT EXISTS respostas_quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    pergunta VARCHAR(500) NOT NULL,
    alternativa_escolhida VARCHAR(255) NOT NULL,
    acertou TINYINT(1) NOT NULL,
    data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_respostas_quiz_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_respostas_quiz_usuario (usuario_id),
    INDEX idx_respostas_quiz_acertou (acertou)
);