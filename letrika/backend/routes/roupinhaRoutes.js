const express = require('express');
const {
  listarRoupinhas,
  desbloquearRoupinha,
  equiparRoupinha
} = require('../controllers/roupinhaController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', isAuthenticated, listarRoupinhas);
router.post('/', isAuthenticated, desbloquearRoupinha);
router.put('/equipada', isAuthenticated, equiparRoupinha);

module.exports = router;
