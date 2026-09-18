const db = require('../config/database');

const getPerguntas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM perguntas WHERE ativo = 1 ORDER BY id');
    return res.status(200).json({ perguntas: rows });
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    return res.status(500).json({ message: 'Erro ao buscar perguntas.' });
  }
};

const getPerguntaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM perguntas WHERE id = ? AND ativo = 1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pergunta não encontrada.' });
    }

    return res.status(200).json({ pergunta: rows[0] });
  } catch (error) {
    console.error('Erro ao buscar pergunta:', error);
    return res.status(500).json({ message: 'Erro ao buscar pergunta.' });
  }
};

module.exports = {
  getPerguntas,
  getPerguntaById
};
