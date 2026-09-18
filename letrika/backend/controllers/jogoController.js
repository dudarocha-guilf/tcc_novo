const db = require('../config/database');

const getJogos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jogos WHERE ativo = 1 ORDER BY id');
    return res.status(200).json({ jogos: rows });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return res.status(500).json({ message: 'Erro ao buscar jogos.' });
  }
};

const getJogoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM jogos WHERE id = ? AND ativo = 1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }

    return res.status(200).json({ jogo: rows[0] });
  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    return res.status(500).json({ message: 'Erro ao buscar jogo.' });
  }
};

module.exports = {
  getJogos,
  getJogoById
};
