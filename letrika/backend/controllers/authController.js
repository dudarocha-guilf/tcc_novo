const bcrypt = require('bcryptjs');
const db = require('../config/database');

const registerUser = async (req, res) => {
  try {
    const { nome, nome_usuario, email, senha, confirmarSenha } = req.body;

    if (!nome || !nome_usuario || !email || !senha || !confirmarSenha) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    if (nome.trim().length < 2) {
      return res.status(400).json({ message: 'O nome deve ter pelo menos 2 caracteres.' });
    }

    if (nome_usuario.trim().length < 3) {
      return res.status(400).json({ message: 'O nome de usuário deve ter pelo menos 3 caracteres.' });
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      return res.status(400).json({ message: 'Digite um e-mail válido.' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    if (senha !== confirmarSenha) {
      return res.status(400).json({ message: 'As senhas não conferem.' });
    }

    const nomeLimpo = nome.trim();
    const nomeUsuarioLimpo = nome_usuario.trim();
    const emailLimpo = email.trim().toLowerCase();

    const [usuariosExistentes] = await db.query(
      'SELECT email, nome_usuario FROM usuarios WHERE email = ? OR nome_usuario = ?',
      [emailLimpo, nomeUsuarioLimpo]
    );

    if (usuariosExistentes.length > 0) {
      const emailDuplicado = usuariosExistentes.some((usuario) => usuario.email === emailLimpo);
      if (emailDuplicado) {
        return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
      }

      return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [resultado] = await db.query(
      'INSERT INTO usuarios (nome, nome_usuario, email, senha, avatar) VALUES (?, ?, ?, ?, ?)',
      [nomeLimpo, nomeUsuarioLimpo, emailLimpo, senhaHash, 'default-avatar.png']
    );

    return res.status(201).json({
      message: 'Cadastro realizado com sucesso!',
      usuario: {
        id: resultado.insertId,
        nome: nomeLimpo,
        nome_usuario: nomeUsuarioLimpo,
        email: emailLimpo
      }
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return res.status(500).json({ message: 'Erro interno ao tentar cadastrar usuário.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Informe e-mail e senha.' });
    }

    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const usuario = usuarios[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    req.session.user = {
      id: usuario.id,
      nome: usuario.nome,
      nome_usuario: usuario.nome_usuario,
      email: usuario.email,
      avatar: usuario.avatar
    };

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      usuario: req.session.user
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno ao tentar entrar.' });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: 'Não foi possível sair da conta.' });
    }

    return res.status(200).json({ message: 'Logout realizado com sucesso!' });
  });
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Você precisa entrar para acessar esta área.' });
    }

    const [usuarios] = await db.query(
      'SELECT id, nome, nome_usuario, email, avatar, data_cadastro FROM usuarios WHERE id = ?',
      [req.session.user.id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json({ usuario: usuarios[0] });
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return res.status(500).json({ message: 'Erro ao buscar dados do usuário.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};
