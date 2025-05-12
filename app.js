const express = require('express');
const usuarioRouter = require('./routes/usuario');

const PORT = 3000;

const app = express();

app.use('/usuario', usuarioRouter);

app.listen(PORT, function () {
    console.log('PetAgenda Back-end running on TCP port ', PORT);   
});

module.exports = app;