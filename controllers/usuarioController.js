const usuarioModel = require('../models/usuario');
const { createHmac } = require('node:crypto');

exports.create = async function (req, res, next) {
    console.log('recebido ', req.body);

    let usr;
    try {
        const { email, senha, perguntaSeguranca: { pergunta, resposta } }  = req.body;

        usr = {
            email: email,
            senha: senha,
            perguntaSeguranca: {
                pergunta: pergunta,
                resposta: resposta
            }
        };
    } catch (err) {
        console.log('errooo: ', err);
        res.status(500).json({
            success: false,
            message: "Objeto inválido para cadastro de usuário",
            errors: [
                err
            ]
        });
    }

    usuarioModel.create(usr)
        .then(results => {
            res.json({
                success: true,
                message: "Usuário cadastrado com sucesso!"
            });
        })
        .catch(err => {
            next(err);
        });
}

exports.login = async function (req, res, next) {
    const userCredentials = req.body; // json { email: String, senha: String }

    usuarioModel.find(userCredentials)
        .then( usr => {
            if (usr) { // Usuário encontrado
                console.log('login: usr encontrado >> ', usr);

                const header = Buffer.from(JSON.stringify({
                        alg: "HS256",
                        typ: "JWT"
                    }))
                    .toString('base64url');



                const payload = Buffer.from(JSON.stringify({
                        iss: "petagenda-backend",
                        sub: userCredentials.email,
                        exp: Math.floor(Date.now() / 1000 + 120), // Dois minutos no futuro
                        token: '123token',
                        user: usr.id,
                        admin: (usr.e_admin == 'Y') ? true : false
                    }))
                    .toString('base64url');


                const hash = createHmac('sha256', 'petagenda');
                hash.update(header + "." + payload);
                const signature = hash.digest('base64url');

                const jwt = `${header}.${payload}.${signature}`;
                console.log('jwt gerado: ', jwt);

                res.type('text/plain');
                res.status(200).send(jwt);
            } else {
                console.log('usr não encontrado: ', req.body);
                res.status(400).send();
            }
        })
        .catch(err => {
            next(err);
        });
}

exports.list = function (req, res) {
    res.send('list work');
}

exports.info = function (req, res) {
    res.send('info work');
}


exports.update = function (req, res) {
    res.send('update work');
}

exports.delete = function (req, res) {
    res.send('delete work');
}

