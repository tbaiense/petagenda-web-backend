const express = require('express');
const router = require('./router');
const db = require('./db');
const setHeaders = require('./utils/setHeaders');
const { parseJWT, verifyJWT } = require('./utils/jwt');
const PORT = 3000;

const app = express();

// Utils middleware

app.use(setHeaders);
app.use(parseJWT);

// app.use((req, res, next) => {
//     try {
//         verifyJWT(req.jwt);
//         next();
//     } catch (err) {
//         console.log('erro ao verificar token: ', err.message);
//         next(err);
//     }
// });

// Route handling

app.use(router);

// Error handlers

app.use((err, req, res, next) => {
    console.error(err);
    next(err);
});

app.use((err, req, res, next) => {
    console.log(`erro ao realizar operação (${req.METHOD} ${req.url}):`, err.message);
    res.status(400).json({
        success: false,
        message: "Falha ao realizar a operação",
        errors: [
            err.message
        ]
    });
});

app.listen(PORT, '127.1.1.1', function () {
    console.log('PetAgenda Back-end running on TCP port ', PORT);   
});

module.exports = app;
