const { createHmac } = require('node:crypto');

exports.generateJWT = function(usuario) {
    const { id, e_admin } = usuario;

    const header = Buffer.from(JSON.stringify({
        alg: "HS256",
        typ: "JWT"
    }))
    .toString('base64url');

    const payload = Buffer.from(JSON.stringify({
        iss: "petagenda-backend",
        exp: Math.floor(Date.now() / 1000 + 900), // Dois minutos no futuro
        user: id,
        admin: (e_admin == 'Y') ? true : false
    }))
    .toString('base64url');


    const hash = createHmac('sha256', process.env.JWT_HMAC_SECRET ?? 'petagenda');
    hash.update(header + "." + payload);
    const signature = hash.digest('base64url');

    const jwt = `${header}.${payload}.${signature}`;

    return jwt;
};


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

    if (jwt.payload.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error('token expirado');
    }
};
