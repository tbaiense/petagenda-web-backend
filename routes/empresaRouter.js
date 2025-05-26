const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const empresaController = require('../controllers/empresaController');
const licencaController = require('../controllers/licencaController');

const servicoOferecidoRouter = require('./servicoOferecidoRouter');
const funcionarioRouter = require('./funcionarioRouter');
const clienteRouter = require('./clienteRouter');

router.use(bodyParser.json({limit: '5mb'}));

const appPath = require('../path');

router.route('/')
    .get(empresaController.list)
    .post(empresaController.create);

router.route('/:idEmpresa')
    .get(empresaController.info)
    .put(empresaController.update)
    .delete(empresaController.delete);

router.route('/:idEmpresa/foto-perfil')
    .get(empresaController.profile_pic);

router.route('/:idEmpresa/licenca')
    .get(licencaController.info)
    .post(licencaController.set)
    .put(licencaController.set);

router.use('/:idEmpresa/servico-oferecido', servicoOferecidoRouter);
router.use('/:idEmpresa/funcionario', funcionarioRouter);
router.use('/:idEmpresa/cliente', clienteRouter);


module.exports = router;
