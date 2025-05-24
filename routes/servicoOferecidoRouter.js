const express = require('express');
const router = express.Router({ mergeParams: true });

const servicoOferecidoController = require('../controllers/servicoOferecidoController');

router.route('/')
    .get((req, res, next) => {
        res.send('NOT IMPLEMENTED YET: servico-oferecido LIST');
    })
    .post(servicoOferecidoController.create);

router.route('/:idServicoOferecido')
    .get(servicoOferecidoController.list)
    .put(servicoOferecidoController.update)
    .delete(servicoOferecidoController.delete);

router.route('/:idServicoOferecido/foto')
    .get(servicoOferecidoController.servico_pic);

module.exports = router;