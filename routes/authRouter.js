const express = require('express');
const router = express.Router();

const { createHmac } = require('node:crypto');



router.post('/verify-token', (req, res, next) => {
    function reject(msg) {
        res.status(400).json({
            success: false,
            message: msg
        });
    }

    try {
        const jwt = req.headers["authorization"].split(" ")[1];

        // Verificando signature
        const [ header, payload, signature ] = jwt.split('.');

        const headerObj = JSON.parse(Buffer.from(header, 'base64url').toString());
        const payloadObj = JSON.parse(Buffer.from(payload, 'base64url').toString());

        if (headerObj.alg !== 'HS256') {
            reject('Algoritmo de hash inválido');
            return;
        }

        const hmac = createHmac('sha256', 'petagenda');
        hmac.update(header + "." + payload);
        const digest = hmac.digest('base64url');

        console.log('authHeader: ', jwt);
        let errMsg;

        if (digest !== signature) {
            reject('signature diferente');
            return;
        }

        if (payloadObj.iss !== "petagenda-backend") {
            reject('issuer desconhecido');
            return;
        }

        if (payloadObj.exp <= Math.floor(Date.now() / 1000)) {
            reject('token expirado');
            return;
        }

        if (payloadObj.token !== '123token') {
            reject('token inválido');
            return;
        }

        console.log('jwt aceito!');
        res.json({
            success: true,
            message: 'JWT aceito',
            user: payloadObj.user,
            admin: payloadObj.admin
        });

        return;
    } catch (err) {
        console.log('jwt rejeitado! ', headerObj, payloadObj);
        next(err);
    }
});

module.exports = router;
