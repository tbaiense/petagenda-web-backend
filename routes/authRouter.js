const express = require('express');
const router = express.Router();

const { createHmac } = require('node:crypto');
const { parseJWT, verifyJWT } = require('../utils/jwt');


router.post('/verify-token', parseJWT, (req, res, next) => {
    function reject(msg) {
        res.status(400).json({
            success: false,
            message: msg
        });
    }

    try {
        verifyJWT(req.jwt);

        console.log('jwt aceito!');
        res.json({
            success: true,
            message: 'JWT aceito',
            user: req.jwt.payload.user,
            admin: req.jwt.payload.admin
        });

        return;
    } catch (err) {
        console.log('jwt rejeitado! ', req.jwt.header, req.jwt.payload);
        next(err);
    }
});

module.exports = router;
