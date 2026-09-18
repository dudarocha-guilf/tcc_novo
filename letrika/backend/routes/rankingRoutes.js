const express = require('express');
const { getRankingGeral, getRankingPorJogo } = require('../controllers/rankingController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', isAuthenticated, getRankingGeral);
router.get('/jogo/:jogoId', isAuthenticated, getRankingPorJogo);

module.exports = router;
