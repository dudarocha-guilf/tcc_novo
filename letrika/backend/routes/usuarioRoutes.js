const express = require('express');
const { getUsuarioById, updateUsuario, deleteUsuario } = require('../controllers/usuarioController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', isAuthenticated, getUsuarioById);
router.put('/:id', isAuthenticated, updateUsuario);
router.delete('/:id', isAuthenticated, deleteUsuario);

module.exports = router;
