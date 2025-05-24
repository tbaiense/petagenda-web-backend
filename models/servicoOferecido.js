const { ServicoOferecido: ServicoOferecidoDB } = require('../db');

/*
MODELO DE CLASSE PARA SERVIÇO OFERECIDO

Modelo JSON:
{   
    "id": <INT>,
    "idServicoOferecido": <INT>,
    "nome": <VARCHAR(64)>,
    "categoria": <INT>,
    "nomeCategoria": <VARCHAR>
    "preco": <DECIMAL(8,2)>,
    "tipoPreco": <ENUM("pet", "servico")>,  <-- forma de cobrança do preço
    "descricao": ?<TEXT>,
    "foto": ?<TEXT>,   <-- caminho de arquivo "/caminho/image.png"
    "restricaoParticipante": <ENUM("coletivo", "individual")>,
    "restricaoEspecie": ?[
        +{
            "especie": <INT>  <-- PK da tabela "especie",
            "nomeEspecie": <varchar>
        }
    ]
}
*/
class ServicoOferecido {
    static fromResultSet(rs) {
        const servObj = {
            id: rs.id_servico_oferecido,
            nome: rs.nome,
            categoria: rs.id_categoria,
            nomeCategoria: rs.nome_categoria,
            preco: rs.preco,
            tipoPreco: rs.tipo_preco,
            descricao: rs.descricao,
            foto: rs.foto,
            restricaoParticipante: rs.restricao_participante
        };
    }

    // TODO: anexar restricaoEspecie ao objeto de resposta 
    static async find(filter, options) {
        if (filter && !(filter instanceof Object)) {
            throw new TypeError('Filter deve ser Object');
        }

        if (options && !(options instanceof Object)) {
            throw new TypeError('Options deve ser Object');
        }

        if (!filter || typeof filter != 'object' || !Number.isInteger(filter.idServicoOferecido)) {
            throw new Error('filter parameter must be an object and contain at least idServicoOferecido that is an integer');
        }
        
        if (!Number.isInteger(filter.id)) {
            filter.id = undefined;
        }

        if (!options || (!Number.isInteger(options.limit) || !Number.isInteger(options.page))) {
            options = { limit: 10, page: 0, useClass: false };
        }

        const { id, idServicoOferecido } = filter; // Object representando a servicoOferecido
        const { limit, page, useClass } = options;

        // Buscar no banco servicos oferecidos
        let servicoList;
        const conn = await ServicoOferecidoDB.createConnection({ id: idServicoOferecido });

        try {
            if (Number.isInteger(id)) { 
                const [ results ] = await conn.execute(
                    `SELECT * FROM servico_oferecido WHERE id = ? LIMIT 1`,
                    [id]
                );
                const objServ = ServicoOferecido.fromResultSet(results[0]);

                servicoList = [ useClass ? new ServicoOferecido(objServ) : objServ ];
            } else { // Buscar várias ServicoOferecidos
                const [ results ] = await conn.execute(
                    `SELECT * FROM servico_oferecido ORDER BY id DESC LIMIT ${limit} OFFSET ${limit * page}`
                );

                servicoList = results.map( emp => {
                    const objServ = ServicoOferecido.fromResultSet(emp);

                    return useClass ? new ServicoOferecido(objServ) : objServ;
                });
            }
            return servicoList;
        } catch (err) {
            conn.end();
            throw new Error("Falha ao buscar registros de ServicoOferecido");
        }
    } 

    constructor(servicoOferecido) {
        if (typeof servicoOferecido != 'object') {
            throw new TypeError('servicoOferecido argument must be an object containing information for servicoOferecido');
        }

        const {
            id,
            idServicoOferecido,
            nome,
            categoria,
            nomeCategoria,
            preco,
            tipoPreco,
            descricao,
            foto,
            restricaoParticipante,
            restricaoEspecie
        } = servicoOferecido;
        
        this.id = id;
        this.idServicoOferecido = idServicoOferecido;
        this.nome = nome;
        this.categoria = categoria;
        this.nomeCategoria = nomeCategoria;
        this.preco = preco;
        this.tipoPreco = tipoPreco;
        this.descricao = descricao;
        this.foto = foto;
        this.restricaoParticipante = restricaoParticipante;
        this.restricaoEspecie = restricaoEspecie;
    }


    #_isNew = true;

    set isNew(isNew) {
        if (typeof isNew != 'boolean') throw new TypeError('value for isNew must be boolean');

        this.#_isNew = isNew;
    }

    get isNew() {
        return this.#_isNew;
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

    #_idServicoOferecido;

    set idServicoOferecido(idServicoOferecido) {
        if (!Number.isInteger(idServicoOferecido)) throw new TypeError('id must be an integer');

        this.#_idServicoOferecido = idServicoOferecido;
    }

    get idServicoOferecido() {
        return this.#_idServicoOferecido;
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

    #_categoria;

    set categoria(categoria) {
        if (Number.isInteger(categoria)) {
            this.#_categoria = categoria;
        } else {
            throw new TypeError('categoria must be an integer');
        }
    }

    get categoria() {
        return this.#_categoria;
    }

    #_nomeCategoria;

    set nomeCategoria(nomeCategoria) {
        if (!nomeCategoria) {
            this.#_nomeCategoria = undefined;
            return;
        } else if (typeof nomeCategoria != 'string' || nomeCategoria.length < 3) {
            throw new TypeError('nomeCategoria value must be a string with at least 3 characters');
        }
        // TODO: validar string de nome
        this.#_nomeCategoria = nomeCategoria;
    }

    get nomeCategoria() {
        return this.#_nomeCategoria;
    }

    #_preco;

    set preco(preco) {
        if (typeof preco != 'number') {
            throw new TypeError('preco value must be a decimal number');
        }

        if (preco < 0 || !Number.isFinite(preco)) {
            throw new Error('preco must be a positive finite number');
        }

        this.#_preco = preco;
    }

    get preco() {
        return this.#_preco;
    }

    #_tipoPreco;

    set tipoPreco(tipoPreco) {
        if (typeof tipoPreco != 'string') throw new TypeError('tipoPreco value must be a string');

        if (tipoPreco == 'pet' || tipoPreco == 'servico') {
            this.#_tipoPreco = tipoPreco;
        } else {
            throw new Error('invalid value for tipoPreco in licenca');
        }
    }

    get tipoPreco() {
        return this.#_tipoPreco;
    }

    #_descricao;

    set descricao(descricao) {
        if (typeof descricao != 'string') {
            if (descricao != null && descricao != undefined) {
                throw new TypeError('descricao value must be a string or undefined or null');
            } else {
                this.#_descricao = undefined;
            }
        } else if ((descricao = descricao.trim()).length == 0) {
            this.#_descricao = undefined;
        } else {
            this.#_descricao = descricao;
        }
    }

    get descricao() {
        return this.#_descricao;
    }

    #_foto;

    set foto(value) {
        if (typeof value == 'string') {
            this.#_foto = value;
        } else if (!value) {
            this.#_foto = undefined;
        } else {
            throw new TypeError("Foto deve ser String");
        }
    }

    get foto() {
        return this.#_foto;
    }

    #_restricaoParticipante;

    set restricaoParticipante(restricaoParticipante) {
        if (typeof restricaoParticipante != 'string') {
            throw new TypeError('restricaoParticipante value must be a string');
        }

        if (restricaoParticipante == 'coletivo' || restricaoParticipante == 'individual') {
            this.#_restricaoParticipante = restricaoParticipante;
        } else {
            throw new Error('invalid value for restricaoParticipante in servicoOferecido');
        }
    }

    get restricaoParticipante() {
        return this.#_restricaoParticipante;
    }

    #_restricaoEspecie;

    set restricaoEspecie(restricaoEspecie) {
        if (!restricaoEspecie) {
            this.#_restricaoEspecie = undefined;
        } else if (restricaoEspecie instanceof Array) {
            this.#_restricaoEspecie = restricaoEspecie.map( restricao => {
                if (Number.isInteger(restricao.especie)) {
                    return { 
                        especie: restricao.especie, 
                        nomeEspecie: (typeof restricao.nomeEspecie == 'string' && restricao.nomeEspecie) ? restricao.nomeEspecie : undefined
                    };
                } else {
                    throw new TypeError('restricaoEspecie contain objects that do not have a valid especie value: must be integer');
                }
            });
        } else {
            throw new Error('restricaoEspecie must be undefined or an object containing especie');
        }
    }

    get restricaoEspecie() {
        return this.#_restricaoEspecie;
    }

    async save() {
        const conn = await ServicoOferecidoDB.createConnection({ id: this.idServicoOferecido });

        // Criar servicoOferecio
        const json = JSON.stringify(this);
        if (this.isNew) {
            
            const [ results ] = await conn.execute(
                'CALL servico_oferecido("insert", ?)',
                [json]
            );

            const id = results[0][0].id_serv;
            this.id = id;
            return id;
        } else {
            const [ results ] = await conn.execute(
                'CALL servico_oferecido("update", ?)',
                [json]
            );
            return this.id;
        }
    }

    toJSON() {
        return {
            id: this.id,
            idServicoOferecido: this.idServicoOferecido,
            nome: this.nome,
            categoria: this.categoria,
            nomeCategoria: this.nomeCategoria,
            preco: this.preco,
            tipoPreco: this.tipoPreco,
            descricao: this.descricao,
            foto: this.foto,
            restricaoParticipante: this.restricaoParticipante,
            restricaoEspecie: this.restricaoEspecie,
        };
    }

    toString() {
        return `${this.nome} (R$ ${this.preco})`;
    }
}

module.exports = ServicoOferecido;