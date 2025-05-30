const ServicoRealizado = require('../models/servicoRealizado');
const { empresa: empresaDB } = require('../db');

exports.create = async (req, res, next) => {
    let novoServReal;
    idEmpresa = Number(req.params.idEmpresa);

    try {
        novoServReal = {
            ...req.body,
            idEmpresa,
        };
        novoServReal = new ServicoRealizado(novoServReal);
    } catch (err) {
        next(err);
        return;
    }

    // Obtendo conexão
    let conn;
    try {
        conn = await empresaDB.createConnection({ id: idEmpresa });
    } catch (err) {
        next(err);
        return;
    }

    try {
        // salvar no banco
        await conn.query('START TRANSACTION');
        const idServicoRealizado = await novoServReal.save(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Serviço realizado cadastrado com sucesso!"
        });
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }
};

exports.info = (req, res, next) => {
//     ServicoRealizado.find({ id: Number(req.params.idServicoRealizado), idEmpresa: Number(req.params.idEmpresa)})
//     .then( agendFound => {
//         if (agendFound.length > 1) {
//             next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
//             return;
//         }
//
//         if (!agendFound[0]) res.status(404);
//
//         res.json({ agendamento: agendFound[0] ?? {} });
//     })
//     .catch( err => {
//         next(err);
//     });
};


exports.list = (req, res, next) => {
    /*
    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
    };

    ServicoRealizado.find(filter)
    .then( agendList => {
        if (agendList.length == 0) res.status(404);

        res.json( { agendamentos: [ ...agendList ] });
    })
    .catch( err => {
        next(err);
    });
    */
};

exports.update = (req, res, next) => {
    res.send("NOT IMPLEMENTED YET: pet UPDATE");
};

exports.delete = (req, res, next) => {
    res.send("NOT IMPLEMENTED YET: pet DELETE");
};
