const Licenca = require('../models/licenca');

exports.set = async (req, res, next) => {
    const { tipo, inicio, fim } = req.body;

    let novaLicenca = {
        idEmpresa: Number(req.params.idEmpresa),
        tipo,
        inicio,
        fim
    };

    try {
        novaLicenca = new Licenca(novaLicenca);
    } catch (err) {
        next(new Error('Informações inválidas para criação de objeto de licença: ' + err.message));
        return;
    }

    // salvar no banco
    await novaLicenca.save();
    res.json({
        success: true,
        message: "Licença atualizada com sucesso!"
    });
};

exports.info = async (req, res, next) => {
    Licenca.find({idEmpresa: Number(req.params.idEmpresa)})
        .then( found => {
            res.json({licencaEmpresa: found[0]});
        }).catch( err => {
            next(err);
        });
};