const usuarioModel = require('../models/usuario');

exports.list = function (req, res) {
    res.send('list work');
}

exports.info = function (req, res) {
    res.send('info work');
}

exports.create = async function (req, res) {
    const usr = {
        email: 'novo@email.com',
        senha: 'novasenha',
        perguntaSeguranca: {
            pergunta: 'pergunta1',
            resposta: 'resposta1'
        }
    };

    const criado = await usuarioModel.create(usr);
    res.json(criado);
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