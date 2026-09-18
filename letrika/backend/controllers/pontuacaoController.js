const db = require('../config/database');

const salvarPontuacao = async (req, res) => {
  try {
    const { jogo_id, pontuacao } = req.body;

    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Você precisa estar logado para salvar pontuação.' });
    }

    if (!jogo_id || !pontuacao && pontuacao !== 0) {
      return res.status(400).json({ message: 'Jogo e pontuação são obrigatórios.' });
    }

    const valor = Number(pontuacao);
    if (Number.isNaN(valor) || valor < 0) {
      return res.status(400).json({ message: 'Pontuação inválida.' });
    }

    await db.query(
      'INSERT INTO pontuacoes (usuario_id, jogo_id, pontuacao) VALUES (?, ?, ?)',
      [req.session.user.id, jogo_id, valor]
    );

    return res.status(201).json({ message: 'Pontuação salva com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar pontuação:', error);
    return res.status(500).json({ message: 'Erro ao salvar pontuação.' });
  }
};

const getPontuacoesUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const [rows] = await db.query(
      `SELECT p.id, p.pontuacao, p.data_partida, j.nome AS jogo_nome
       FROM pontuacoes p
       INNER JOIN jogos j ON j.id = p.jogo_id
       WHERE p.usuario_id = ?
       ORDER BY p.data_partida DESC`,
      [usuarioId]
    );

    return res.status(200).json({ pontuacoes: rows });
  } catch (error) {
    console.error('Erro ao buscar pontuações:', error);
    return res.status(500).json({ message: 'Erro ao buscar pontuações.' });
  }
};

module.exports = {
  salvarPontuacao,
  getPontuacoesUsuario
};
