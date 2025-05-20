const Empresa = require('../models/empresa');

exports.list = function (req, res) {
    Empresa.find()
        .then( empresaList => {
            res.json(empresaList);
        });
}

exports.create = async function (req, res, next) {
    // criar objeto empresa
    const { razaoSocial, nomeFantasia, cnpj, lema, foto, endereco } = req.body;

    let novaEmpresa;
    try {
        novaEmpresa = new Empresa({
            razaoSocial,
            nomeFantasia,
            cnpj,
            lema,
            foto,
            endereco
        });
    } catch (err) {
        next(new Error('Informações inválidas para criação de empresa: ' + err.message));
        return;
    }

    // salvar no banco
    novaEmpresa.save().then( id => {
        res.json({ id: id });
    });

    // associar registro da empresa ao usuário
}
exports.info = function (req, res) {
    res.send('empresa info work');
}
exports.update = function (req, res) {
    res.send('empresa update work');
}
exports.delete = function (req, res) {
    res.send('empresa delete work');
}
