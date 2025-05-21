const usuarioModel = require('../models/usuario');
const { createHmac } = require('node:crypto');
const { generateJWT } = require('../utils/jwt');

exports.create = async function (req, res, next) {
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

    const usr = await usuarioModel.find(userCredentials)
        .then( usr => {
            if (usr) { // Usuário encontrado
                try {
                    const jwt = generateJWT(usr);

                    res.status(200).json({
                        success: true,
                        message: "Usuário logado com sucesso!",
                        token: jwt
                    });
                } catch (err) {
                    next(err);
                }
            } else {
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

