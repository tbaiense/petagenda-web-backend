const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('NOT IMPLEMENTED: usuario_list GET');
});

router.post('/', (req, res, next) => {
    res.send('NOT IMPLEMENTED: usuario_create POST');
});

router.post('/login', (req, res, next) => {
    res.send('NOT IMPLEMENTED: usuario_login POST');
});

router.get('/:id', (req, res, next) => {
    res.send('NOT IMPLEMENTED: usuario_details GET');
});

router.put('/:id', (req, res, next) => {
    res.send('NOT IMPLEMENTED: usuario_update PUT');
});

router.delete('/:id', (req, res, next) => {
    res.send('NOT IMPLEMENTED: usuario_delete DELETE');
});

module.exports = router;