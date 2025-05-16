const usuarioModel = require('../models/usuario');

exports.list = function (req, res) {
    res.send('list work');
}

exports.info = function (req, res) {
    res.send('info work');
}

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

exports.update = function (req, res) {
    res.send('update work');
}

exports.delete = function (req, res) {
    res.send('delete work');
}

exports.login = function (req, res) {
    res.send('login work');
}
