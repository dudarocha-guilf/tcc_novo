const db = require('../config/database');

const listarRoupinhas = async (req, res) => {
  try {
    const [roupinhas] = await db.query(
      `SELECT id, emoji, nome, equipada, data_conquista
       FROM roupinhas_usuario
       WHERE usuario_id = ?
       ORDER BY data_conquista ASC`,
      [req.session.user.id]
    );

    return res.status(200).json({ roupinhas });
  } catch (error) {
    console.error('Erro ao listar roupinhas:', error);
    return res.status(500).json({ message: 'Não foi possível carregar o guarda-roupa.' });
  }
};

const desbloquearRoupinha = async (req, res) => {
  try {
    const { emoji, nome } = req.body;

    if (!emoji || !nome) {
      return res.status(400).json({ message: 'Emoji e nome da roupinha são obrigatórios.' });
    }

    await db.query(
      `INSERT INTO roupinhas_usuario (usuario_id, emoji, nome)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE nome = VALUES(nome)`,
      [req.session.user.id, emoji, nome]
    );

    return res.status(201).json({ message: 'Roupinha guardada na sua coleção.' });
  } catch (error) {
    console.error('Erro ao desbloquear roupinha:', error);
    return res.status(500).json({ message: 'Não foi possível guardar a roupinha.' });
  }
};

const equiparRoupinha = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { emoji } = req.body;
    const usuarioId = req.session.user.id;

    await connection.beginTransaction();
    await connection.query('UPDATE roupinhas_usuario SET equipada = 0 WHERE usuario_id = ?', [usuarioId]);
    const [resultado] = await connection.query(
      'UPDATE roupinhas_usuario SET equipada = 1 WHERE usuario_id = ? AND emoji = ?',
      [usuarioId, emoji]
    );

    if (resultado.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Essa roupinha ainda não foi conquistada.' });
    }

    await connection.commit();
    return res.status(200).json({ message: 'Roupinha equipada!' });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao equipar roupinha:', error);
    return res.status(500).json({ message: 'Não foi possível equipar a roupinha.' });
  } finally {
    connection.release();
  }
};

module.exports = {
  listarRoupinhas,
  desbloquearRoupinha,
  equiparRoupinha
};
