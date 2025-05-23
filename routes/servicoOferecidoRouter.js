const express = require('express');
const router = express.Router({ mergeParams: true });

const servicoOferecidoController = require('../controllers/servicoOferecidoController');

router.route('/')
    .get((req, res, next) => {
        res.send('NOT IMPLEMENTED YET: servico-oferecido LIST');
    })
    .post(servicoOferecidoController.create);

module.exports = router;