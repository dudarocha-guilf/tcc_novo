const db = require('../config/database');

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT id, nome, nome_usuario, email, avatar, data_cadastro FROM usuarios WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json({ usuario: rows[0] });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, nome_usuario, email, avatar } = req.body;

    if (!nome || !nome_usuario || !email) {
      return res.status(400).json({ message: 'Nome, nome de usuário e e-mail são obrigatórios.' });
    }

    const [existing] = await db.query(
      'SELECT id FROM usuarios WHERE (email = ? OR nome_usuario = ?) AND id != ?',
      [email.trim().toLowerCase(), nome_usuario.trim(), id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'E-mail ou nome de usuário já em uso.' });
    }

    await db.query(
      'UPDATE usuarios SET nome = ?, nome_usuario = ?, email = ?, avatar = ? WHERE id = ?',
      [nome.trim(), nome_usuario.trim(), email.trim().toLowerCase(), avatar || 'default-avatar.png', id]
    );

    return res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const usuarioId = Number(req.session.user.id);

    if (usuarioId !== Number(req.params.id)) {
      return res.status(403).json({ message: 'Você só pode excluir a própria conta.' });
    }

    const [resultado] = await db.query('DELETE FROM usuarios WHERE id = ?', [usuarioId]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Conta não encontrada.' });
    }

    req.session.destroy((error) => {
      if (error) {
        console.error('Erro ao encerrar sessão após exclusão:', error);
      }
    });

    return res.status(200).json({ message: 'Sua conta foi excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ message: 'Não foi possível excluir a conta.' });
  }
};

module.exports = {
  getUsuarioById,
  updateUsuario,
  deleteUsuario
};
