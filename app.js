const express = require('express');
const router = require('./router');
const db = require('./db');

const PORT = 3000;

const app = express();

app.use(router);

app.listen(PORT, function () {
    console.log('PetAgenda Back-end running on TCP port ', PORT);   
});

module.exports = app;