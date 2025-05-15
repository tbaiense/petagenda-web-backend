const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

router.route('/')
    .get(usuarioController.list)
    .post(usuarioController.create);

router.post('/login', usuarioController.login);

router.route('/:idUsuario')
    .get(usuarioController.info)
    .put(usuarioController.update)
    .delete(usuarioController.delete);

module.exports = router;