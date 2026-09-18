const express = require('express');
const { getPerguntas, getPerguntaById } = require('../controllers/perguntaController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', isAuthenticated, getPerguntas);
router.get('/:id', isAuthenticated, getPerguntaById);

module.exports = router;
