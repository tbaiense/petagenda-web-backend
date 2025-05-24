const express = require('express');
const router = express.Router({ mergeParams: true });

const servicoOferecidoController = require('../controllers/servicoOferecidoController');

router.route('/')
    .get(servicoOferecidoController.list)
    .post(servicoOferecidoController.create);

router.route('/:idServicoOferecido')
    .get(servicoOferecidoController.info)
    .put(servicoOferecidoController.update)
    .delete(servicoOferecidoController.delete);

router.route('/:idServicoOferecido/foto')
    .get(servicoOferecidoController.servico_pic);

module.exports = router;