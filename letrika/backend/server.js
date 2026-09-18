const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const jogoRoutes = require('./routes/jogoRoutes');
const perguntaRoutes = require('./routes/perguntaRoutes');
const pontuacaoRoutes = require('./routes/pontuacaoRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const roupinhaRoutes = require('./routes/roupinhaRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'letrika-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8,
    sameSite: 'lax'
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/jogos', jogoRoutes);
app.use('/api/perguntas', perguntaRoutes);
app.use('/api/pontuacoes', pontuacaoRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/roupinhas', roupinhaRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
