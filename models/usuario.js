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
        this.perguntaSeguranca = { pergunta: pergunta, resposta: resposta };
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
    const json = JSON.stringify(usuario);

    console.log('cadastrando ', json);

    const [ results ] = await conn.execute(
        `CALL usuario(?, ?)`,
        ['insert', json]
    ).catch(err => {
        conn?.end();
        throw err;
    });

    conn?.end();
    return;
};

// Encontrar usuário com base em filtros
exports.find = async function (filter = undefined, options = undefined) {
    if (arguments.length == 1) {
        if (!(filter instanceof Object)) {
            throw new TypeError('Filter não é objeto');
        }

        const { email, senha } = filter;

        if (!email || !senha) {
            throw new Error('Filtro inválido para busca');
        }

        // Procurando usuário pelo email e senha
        const conn = await dbo.createConnection();

        let usr;
        let error;
        try {
            const info = await conn.execute(
                'SELECT `id`, `e_admin` FROM `usuario` WHERE `email` = ? AND `senha`= ? LIMIT 1',
                [email, senha]
            );
            if (info[0].length > 0) {
                const [ results ] = info;
                console.log('info: ', info);
                usr = results[0];
            }
        } catch (err) {
            error = new Error('Erro ao realizar busca pelo usuário: ', err.message);
        } finally {
            conn.end();

            if (error) throw error;

            return usr;
        }
    } else {
        throw new Error('Filtro vazio para busca');
    }
}
