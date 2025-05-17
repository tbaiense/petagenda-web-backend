const express = require('express');
const router = express.Router();

const usuarioRouter = require('./routes/usuarioRouter');
const empresaRouter = require('./routes/empresaRouter');
const authRouter = require('./routes/authRouter');

router.use('/usuario', usuarioRouter);

router.use('/empresa', empresaRouter);

router.use('/auth', authRouter);

module.exports = router;
