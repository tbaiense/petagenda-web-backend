const Licenca = require('../models/licenca');
const { dbo } = require('../db');

exports.set = async (req, res, next) => {
    let novaLicenca;
    try {
        const { tipo, inicio, fim } = req.body;

        novaLicenca = {
            idEmpresa: Number(req.params.idEmpresa),
            tipo,
            inicio,
            fim
        };

        novaLicenca = new Licenca(novaLicenca);
    } catch (err) {
        err.message = "Erro ao instanciar objeto Licenca: " + err.message;
        next(err);
        return;
    }

    // Obtendo conexão
    let conn;
    try {
        conn = await dbo.createConnection();
    } catch (err) {
        next(err);
        return;
    }

    try {
        // salvar no banco
        await conn.query('START TRANSACTION');
        await novaLicenca.save();
        res.json({
            success: true,
            message: "Licença atualizada com sucesso!"
        });

        await conn.query('COMMIT');
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }

};

exports.info = async (req, res, next) => {
    Licenca.find({idEmpresa: Number(req.params.idEmpresa)})
        .then( found => {
            res.json({licencaEmpresa: found[0]});
        }).catch( err => {
            next(err);
        });
};