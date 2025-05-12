const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('NOT IMPLEMENTED: empresa_list GET');
});

router.post('/', (req, res) => {
    res.send('NOT IMPLEMENTED: empresa_create POST');
});

router.get('/:id', (req, res) => {
    res.send('NOT IMPLEMENTED: empresa_detail GET');
});

router.put('/:id', (req, res) => {
    res.send('NOT IMPLEMENTED: empresa_update PUT');
});

router.delete('/:id', (req, res) => {
    res.send('NOT IMPLEMENTED: empresa_delete DELETE');
});

router.get('/:id/licenca', (req, res) => {
    res.send('NOT IMPLEMENTED: licenca_list GET');
});

router.get('/:id/licenca/atual', (req, res) => {
    res.send('NOT IMPLEMENTED: licenca_atual GET');
});

router.post('/:id/licenca/:id/contratar', (req, res) => {
    res.send('NOT IMPLEMENTED: licenca_create POST');
});