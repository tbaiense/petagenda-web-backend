const { createHmac } = require('node:crypto');

exports.parseJWT = function (req, res, next) {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
        const encoded = authHeader.split(" ")[1];

        // Verificando signature
        const parts = encoded.split('.');
        const [ header, payload, signature ] = parts;

        const headerObj = JSON.parse(Buffer.from(header, 'base64url').toString());
        const payloadObj = JSON.parse(Buffer.from(payload, 'base64url').toString());

        if (headerObj.alg !== 'HS256') {
            next(new Error('Algoritmo de hash inválido'));
            return;
        }

        const jwt = {
            encoded: encoded,
            header: {
                encoded: header,
                ...headerObj
            },
            payload: {
                encoded: payload,
                ...payloadObj
            },
            signature: signature
        };

        req.jwt = jwt;
    }

    next();
};

exports.verifyJWT = function (jwt) {

    const hmac = createHmac('sha256', 'petagenda');
    hmac.update(jwt.header.encoded + "." + jwt.payload.encoded);
    const digest = hmac.digest('base64url');

    if (digest !== jwt.signature) {
        throw new Error('signature diferente');
    }

    if (jwt.payload.iss !== "petagenda-backend") {
        throw new Error('issuer desconhecido');
    }

    if (jwt.payload.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error('token expirado');
    }

    if (jwt.payload.token !== '123token') { // TODO: buscar no banco o token
        throw new Error('token inválido');
    }
};
