const { empresa: empresaDB } = require('../db');

/*
MODELO DE CLASSE PARA CLIENTE

JSON:
{
    "id": <INT>,
    "idEmpresa": <INT>,
    "nome": <VARCHAR(64)>,
    "telefone": <CHAR(15)>,
    "servicoRequerido": ?[
        +{ "servico": <INT>, "nome": <VARCHAR(64)> }
    ],
    "endereco": {
        "logradouro": <VARCHAR(128)>,
        "numero": <VARCHAR(16)> ,
        "bairro": <VARCHAR(64)>,
        "cidade": <VARCHAR(64)>,
        "estado": <CHAR(2)>     <-- Sigla da unidade federativa (ex: "DF", "ES")
    }
}
*/

class Cliente {

    // TODO: finalizar
    async static find(filter, options) {
        if (filter && !(filter instanceof Object)) {
            throw new TypeError('Filter deve ser Object');
        }

        if (options && !(options instanceof Object)) {
            throw new TypeError('Options deve ser Object');
        }

        if (!filter || typeof filter != 'object' || !Number.isInteger(filter.idEmpresa)) {
            throw new Error('filter parameter must be an object and contain at least idEmpresa that is an integer');
        }

        if (!Number.isInteger(filter.id)) {
            filter.id = undefined;
        }

        if (!options || (!Number.isInteger(options.limit) || !Number.isInteger(options.page))) {
            options = { limit: 10, page: 0, useClass: false };
        }

        const { id, idEmpresa } = filter; // Object representando a Cliente
        const { limit, page, useClass } = options;

        // Buscar no banco clientes
        let cliList = [];
        const conn = await empresaDB.createConnection({ id: idEmpresa });

        try {
            if (Number.isInteger(id)) {
                const [ results ] = await conn.execute(
                    'SELECT `id` AS `id_funcionario`, `nome`, `telefone` FROM `funcionario` WHERE `id` = ? LIMIT 1',
                    [id]
                );
                console.log();
                if (results.length > 0) {
                    const objFunc = Cliente.fromResultSet(results[0]);
                    cliList = [ useClass ? new Cliente(objFunc) : objFunc ];
                }
            } else { // Buscar várias Clientes
                const [ results ] = await conn.execute(
                    `SELECT id AS id_funcionario, nome, telefone FROM funcionario ORDER BY id DESC LIMIT ${limit} OFFSET ${limit * page}`
                );

                if (results.length > 0) {
                    cliList = results.map( emp => {
                        const objFunc = Cliente.fromResultSet(emp);

                        return useClass ? new Cliente(objFunc) : objFunc;
                    });
                }
            }
            // anexar servico_exercido ao objeto de resposta
            if (cliList.length > 0) {
                const idList = cliList.map( func => {
                    return func.id;
                });

                const idListStr = idList.join(",");
                const [ servExerc ] = await conn.execute( // NESTE MOMENTO -- APENAS NESTE MOMENTO --, EU AMO JAVASCRIPT <3
                `SELECT id_funcionario, id_servico_oferecido, nome_servico FROM vw_servico_exercido WHERE id_funcionario IN (${idListStr})`
                );

                servExerc.forEach( res => {
                    const {
                        id_funcionario: idFunc,
                        id_servico_oferecido: id,
                        nome_servico: nome
                    } = res;

                    const index = cliList.findIndex( func => {
                        return func.id === idFunc;
                    });

                    if (!cliList[index].exerce) {
                        cliList[index].exerce = [];
                    }
                    cliList[index].exerce.push({servico: id, nome: nome});
                });
            }
            conn.end();
            return cliList;
        } catch (err) {
            err.message = "Falha ao buscar registros de Cliente: " + err.message;
            conn.end();
            throw err;
        }
    }

    #_id;

    set id(id) {
        if (Number.isInteger(id)) {
            this.#_id = id;

            if (this.isNew) {
                this.isNew = false;
            }

        } else if (id == null || id == undefined) {
            this.#_id = undefined;
            this.isNew = true;
        } else {
            throw new TypeError('id must be an integer or null or undefined');
        }
    }

    get id() {
        return this.#_id;
    }

    #_idEmpresa;

    set idEmpresa(idEmpresa) {
        if (!Number.isInteger(idEmpresa)) {
            throw new TypeError('idEmpresa must be an integer');
        }

        this.#_idEmpresa = idEmpresa;
    }

    get idEmpresa() {
        return this.#_idEmpresa;
    }

    #_nome;

    set nome(nome) {
        if (typeof nome != 'string' || nome.length < 3) throw new TypeError('nome value must be a string with at least 3 characters');
        // TODO: validar string de nome
        this.#_nome = nome;
    }

    get nome() {
        return this.#_nome;
    }

    #_telefone;

    set telefone(telefone) {
        if (typeof telefone != 'string' || telefone.length < 9) throw new TypeError('telefone value must be a string with at least 3 characters');
        // TODO: validar string de telefone
        this.#_telefone = telefone;
    }

    get telefone() {
        return this.#_telefone;
    }

    #_servicoRequerido;

    set servicoRequerido(servicoRequerido) {
        if (!servicoRequerido) {
            this.#_servicoRequerido = undefined;
        } else if (servicoRequerido instanceof Array) {
            this.#_servicoRequerido = servicoRequerido.map( serv => {
                if (Number.isInteger(serv.id)) {
                    return {
                        servico: serv.id,
                        nome: (typeof serv.nome == 'string' && serv.nome) ? serv.nome : undefined
                    };
                } else {
                    throw new TypeError('servicoRequerido contain one or more objects that do not have a valid id value: must be integer');
                }
            });
        } else {
            throw new Error('servicoRequerido must be undefined or an array containing ServicoOferecido objects');
        }
    }

    get servicoRequerido() {
        return this.#_servicoRequerido;
    }

    #_endereco;

    set endereco(endereco) {
        if (!endereco) {
            throw new TypeError('endereco parameter must be an object, cannot be null or undefined');
        } else if (endereco instanceof Array) {
            this.#_endereco = endereco.map( end => {
                if (end.logradouro && end.numero && end.bairro && end.cidade && end.estado) {
                    return {
                        logradouro: end.logradouro,
                        numero: end.numero,
                        bairro: end.bairro,
                        cidade: end.cidade,
                        estado: end.estado
                    };
                } else {
                    throw new TypeError('endereco object is missing one or more required properties: logradouro, numero, bairro, cidade or estado');
                }
            });
        } else {
            throw new Error('endereco must be undefined or an array containing Endereco objects');
        }
    }

    get endereco() {
        return this.#_endereco;
    }

    contructor(cliente) {
        if (!cliente || typeof cliente != 'object' || cliente instanceof Array) {
            throw new TypeError('cliente parameter must be an object containing Cliente properties');
        }

        const {
            id,
            idEmpresa,
            nome,
            telefone,
            endereco,
            servicoRequerido
        } = cliente;

        this.id = id;
        this.idEmpresa = idEmpresa;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.servicoRequerido = servicoRequerido;
    }

    async save(connParam) {
        if (connParam && typeof connParam != 'object') throw new TypeError('connParam parameter must be undefined or a connection object');

        const conn = (connParam) ? connParam : await empresaDB.createConnection({ id: this.idEmpresa });
        // Criar Cliente
        try {
            const json = JSON.stringify(this);
            let idResponse;
            if (this.isNew) {
                const [ results ] = await conn.execute(
                    'CALL cliente("insert", ?)',
                    [json]
                );

                idResponse = results[0][0].id_cliente;
                this.id = idResponse;
            } else {
                const [ results ] = await conn.execute(
                    'CALL cliente("update", ?)',
                    [json]
                );
                idResponse = this.id;
            }

            if (!connParam) conn.end();
            return idResponse;
        } catch (err) {
            if (!connParam) conn.end();
            err.message = "Falha ao cadastrar ou atualizar registro de cliente: " + err.message;
            throw err;
        }
    }


    toJSON() {
        return {
            id,
            nome,
            telefone,
            endereco,
            servicoRequerido: (servicoRequerido) ? servicoRequerido : undefined
        } = this;
    }

    toString() {}

}

module.exports = Cliente;
