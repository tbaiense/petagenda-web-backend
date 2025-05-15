const { dbo } = require('../db');



function Usuario(email, senha, perguntaSeguranca) {
    
    // if (!(email instanceof String)) {
    //     throw Error('Email não é String');
    // }
    
    // if (!(senha instanceof String)) {
    //     throw Error('Senha não é String');
    // }
    
    // if (perguntaSeguranca && !(perguntaSeguranca instanceof Object)) {
    //     throw Error('Pergunta de segurança não é Object');
    // }
    
    const { pergunta, resposta } = perguntaSeguranca;
    this.email = email;
    this.senha = senha;

    if (pergunta && resposta ) {
        this.pergunta = pergunta;
        this.resposta = resposta;
    }
}

exports.create = async function (usuarioArg) {
    const { email, senha, perguntaSeguranca } = usuarioArg;

    let usuario;
    try {
        usuario = new Usuario(email, senha, perguntaSeguranca);
    } catch (err) {
        throw Error('Informações inválidas para cadastro de usuário');
    }

    const conn = await dbo.createConnection();

    try {
        const [ results ] = await conn.execute(
            `CALL usuario(?, ?)`,
            ['insert', JSON.stringify(usuario)]
        );

        return results;
    } catch (err) {

        console.log(err);
        throw Error('Erro ao cadastrar usuário');
    }
};