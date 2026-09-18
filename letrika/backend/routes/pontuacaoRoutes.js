const express = require('express');
const { salvarPontuacao, getPontuacoesUsuario } = require('../controllers/pontuacaoController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', isAuthenticated, salvarPontuacao);
router.get('/:usuarioId', isAuthenticated, getPontuacoesUsuario);

module.exports = router;
