const db = require('../config/database');

const getRankingGeral = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.nome, u.avatar, u.nome_usuario,
             COALESCE(SUM(p.pontuacao), 0) AS pontuacao_total
      FROM usuarios u
      LEFT JOIN pontuacoes p ON p.usuario_id = u.id
      GROUP BY u.id, u.nome, u.avatar, u.nome_usuario
      ORDER BY pontuacao_total DESC, u.nome ASC
      LIMIT 20
    `);

    return res.status(200).json({ ranking: rows });
  } catch (error) {
    console.error('Erro ao gerar ranking geral:', error);
    return res.status(500).json({ message: 'Erro ao gerar ranking geral.' });
  }
};

const getRankingPorJogo = async (req, res) => {
  try {
    const { jogoId } = req.params;
    const [rows] = await db.query(`
      SELECT u.id, u.nome, u.avatar, u.nome_usuario,
             SUM(p.pontuacao) AS pontuacao_total
      FROM usuarios u
      INNER JOIN pontuacoes p ON p.usuario_id = u.id
      WHERE p.jogo_id = ?
      GROUP BY u.id, u.nome, u.avatar, u.nome_usuario
      ORDER BY pontuacao_total DESC, u.nome ASC
    `, [jogoId]);

    return res.status(200).json({ ranking: rows });
  } catch (error) {
    console.error('Erro ao gerar ranking do jogo:', error);
    return res.status(500).json({ message: 'Erro ao gerar ranking do jogo.' });
  }
};

module.exports = {
  getRankingGeral,
  getRankingPorJogo
};
