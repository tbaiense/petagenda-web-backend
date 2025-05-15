const express = require('express');
const router = express.Router();

const usuarioRouter = require('./routes/usuarioRouter');
const empresaRouter = require('./routes/empresaRouter');

router.use('/usuario', usuarioRouter);

router.use('/empresa', empresaRouter);

module.exports = router;