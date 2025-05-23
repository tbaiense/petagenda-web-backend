const servicoOferecido = require('../models/servicoOferecido');

exports.create = (req, res, next) => {
    const { 
        nome,
        categoria,
        nomeCategoria,
        preco,
        tipoPreco,
        descricao,
        foto,
        retricaoParticipante,
        restricaoEspecie,
    } = req.body;

    let novoServico = {
        idEmpresa: Number(req.params.idEmpresa),
        nome,
        categoria,
        nomeCategoria,
        preco,
        tipoPreco,
        descricao,
        foto,
        retricaoParticipante,
        restricaoEspecie,
    };

    try {
        novoServico = new servicoOferecido(novoServico);
    } catch (err) {
        next(new Error('Informações inválidas para criação de objeto de serviço oferecido: ' + err.message));
        return;
    }

    // salvar no banco
    novaLicenca.save()
        .then( info => {
            res.json({
                success: true,
                message: "Serviço oferecido cadastrado com sucesso!"
            });
        });
};