const express = require('express');
const router = require('./router');
const db = require('./db');
const setHeaders = require('./utils/setHeaders');

const PORT = 3000;

const app = express();

app.use(setHeaders);

app.use(router);

app.use((err, req, res, next) => {
    console.log('erro ao realizar operação: ', err.message);

    res.status(400).json({
        success: false,
        message: "Falha ao realizar a operação",
        errors: [
            err
        ]
    });
});

app.listen(PORT, function () {
    console.log('PetAgenda Back-end running on TCP port ', PORT);   
});

module.exports = app;
