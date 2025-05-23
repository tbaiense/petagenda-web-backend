const ServicoOferecido = require('../models/servicoOferecido');

exports.create = (req, res, next) => {
    const { 
        nome,
        categoria,
        nomeCategoria,
        preco,
        tipoPreco,
        descricao,
        foto,
        restricaoParticipante,
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
        restricaoParticipante,
        restricaoEspecie,
    };
    
    try {
        novoServico = new ServicoOferecido(novoServico);
    } catch (err) {
        // next(new Error('Informações inválidas para criação de objeto de serviço oferecido: ' + err.message));
        next(err);
        return;
    }

    // salvar no banco
    novoServico.save()
        .then( info => {
            res.json({
                success: true,
                message: "Serviço oferecido cadastrado com sucesso!"
            });
        }).catch( err => {
            next(err);
        });
};