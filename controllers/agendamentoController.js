const Agendamento = require('../models/agendamento');
const { empresa: empresaDB } = require('../db');

exports.create = async (req, res, next) => {
    const {
        dtHrMarcada,
        servico,
        funcionario,
        observacoes,
        pets,
        enderecos,
    } = req.body;

    let novoAgend;
    idEmpresa = Number(req.params.idEmpresa);

    try {
        novoAgend = {
            idEmpresa,
            dtHrMarcada,
            servico,
            funcionario,
            observacoes,
            pets,
            enderecos,
        };
        novoAgend = new Agendamento(novoAgend);
    } catch (err) {
        err.message = "Erro ao instanciar objeto Agendamento: " + err.message;
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
        const idAgendamento = await novoAgend.save(conn);
        await conn.query('COMMIT');

        res.json({
            success: true,
            message: "Agendamento cadastrado com sucesso!"
        });
    } catch (err) {
        await conn.query('ROLLBACK');
        next(err);
    } finally {
        conn.end();
    }
};

exports.info = (req, res, next) => {
    Agendamento.find({ id: Number(req.params.idAgendamento), idEmpresa: Number(req.params.idEmpresa)})
    .then( agendFound => {
        if (agendFound.length > 1) {
            next(new Error("Condição inesperada: busca por id retornou mais de um resultado"));
            return;
        }

        if (!agendFound[0]) res.status(404);

        res.json({ agendamento: agendFound[0] ?? {} });
    })
    .catch( err => {
        next(err);
    });
};


exports.list = (req, res, next) => {

    const filter = {
        idEmpresa: Number(req.params.idEmpresa),
    };

    Agendamento.find(filter)
    .then( agendList => {
        if (agendList.length == 0) res.status(404);

        res.json( { agendamentos: [ ...agendList ] });
    })
    .catch( err => {
        next(err);
    });

};

exports.update = (req, res, next) => {
    res.send("NOT IMPLEMENTED YET: pet UPDATE");
};

exports.delete = (req, res, next) => {
    res.send("NOT IMPLEMENTED YET: pet DELETE");
};
