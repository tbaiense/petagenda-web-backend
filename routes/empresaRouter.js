const express = require('express');
const router = express.Router();

const empresaController = require('../controllers/empresaController');

router.route('/')
    .get(empresaController.list)
    .post(empresaController.create);

router.route('/:idEmpresa')
    .get(empresaController.info)
    .put(empresaController.update)
    .delete(empresaController.delete);

module.exports = router;