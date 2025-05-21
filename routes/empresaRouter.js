const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const empresaController = require('../controllers/empresaController');
const serveStatic = require('serve-static');

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

module.exports = router;
