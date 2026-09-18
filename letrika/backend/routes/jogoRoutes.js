const express = require('express');
const { getJogos, getJogoById } = require('../controllers/jogoController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', isAuthenticated, getJogos);
router.get('/:id', isAuthenticated, getJogoById);

module.exports = router;
