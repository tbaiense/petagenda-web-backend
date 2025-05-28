const { empresa: empresaDB } = require('../db');
/*
 Modelo de classe para Agendamento
 JSON:
 {
    "id": <INT>,
    "idEmpresa": <INT>,
    "dtHrMarcada": <DATETIME>,
    "servico": { "id": <INT> },
    "funcionario": { "id": <INT> },
    "observacoes": ?<VARCHAR(250)>,
    "pets" : ?[
        +{
            "id": <INT>,
            "alimentacao": ?<TEXT>,
            "remedios": ?[
                +{ "id": <INT>, "nome": ?<VARCHAR(128)>, "instrucoes": ?<TEXT> }
            ]
        }
    ],
    "enderecos": [
        0,2{
            "tipo": <ENUM("buscar", "devolver", "buscar-devolver")>,
            "logradouro": <VARCHAR(128)>,
            "numero": <VARCHAR(16)>,
            "bairro": <VARCHAR(64)>,
            "cidade": <VARCHAR(64)>,
            "estado": <CHAR(2)>
        }
    ]
 }

 */
class Agendamento {

    #_isNew;

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


    #_idEmpresa;

    set idEmpresa(idEmpresa) {
        if (!Number.isInteger(idEmpresa)) throw new TypeError('idEmpresa must be an integer');

        this.#_idEmpresa = idEmpresa;
    }

    get idEmpresa() {
        return this.#_idEmpresa;
    }


    #_dtHrMarcada;

    set dtHrMarcada(dtHrMarcada) {
        if (typeof dtHrMarcada != 'string' || dtHrMarcada.length < 8) throw new TypeError('dtHrMarcada value must be a string representing a date');
        // TODO: validar string de data
        this.#_dtHrMarcada = dtHrMarcada;
    }

    get dtHrMarcada() {
        return this.#_dtHrMarcada;
    }

    #_servico;

    set servico(servico) {
        if (servico) {
            if (typeof servico !== 'object') throw new TypeError('Informações de servico devem ser Object');

            this.#_servico = {
                ...servico
            };

        } else {
            throw new TypeError('Objeto de servico do pet não pode ser nulo');
        }
    }

    get servico() {
        return this.#_servico;
    }

    #_funcionario;

    set funcionario(funcionario) {
        if (funcionario) {
            if (typeof funcionario !== 'object') throw new TypeError('Informações de funcionario devem ser Object');

            this.#_funcionario = {
                ...funcionario
            };

        } else {
            throw new TypeError('Objeto de funcionario do pet não pode ser nulo');
        }
    }

    get funcionario() {
        return this.#_funcionario;
    }

    #_observacoes;

    set observacoes(observacoes) {
        if (!observacoes) {
            this.#_observacoes = undefined;
            return;
        }

        if (typeof observacoes == 'string') {
            // TODO: validar string de observacoes
            this.#_observacoes = observacoes;
        } else {
            throw new TypeError('Valor inválido para observacoes de agendamento: deve ser string ou undefined');
        }
    }

    get observacoes() {
        return this.#_observacoes;
    }

    #_pets;

    set pets(pets) {
        if (!pets) {
            this.#_pets = undefined;
        } else if (pets instanceof Array) {
            this.#_pets = pets.map( pet => {
                if (Number.isInteger(pet.id)) {
                    const objPet = {
                        id: pet.id,
                        alimentacao: (pet.alimentacao) ? pet.alimentacao : undefined
                    };
                    const remedios = pet.remedios;

                    if (remedios && remedios instanceof Array) {
                        if (!remedios.nome || !remedios.instrucoes) {
                            throw new Error('Um ou mais registros de remédio para pet não possuem nome e/ou instruções');
                        }

                        objPet.remedios = {
                            id: (Number.isInteger(remedios.id)) ? remedios.id : undefined,
                            nome: remedios.nome,
                            instrucoes: remedios.instrucoes
                        };
                    }

                    return objPet;
                } else {
                    throw new TypeError('pets contain objects that do not have a valid id value: must be integer');
                }
            });
        } else {
            throw new Error('pets must be undefined or an array containing Pet objects');
        }
    }

    get pets() {
        return this.#_pets;
    }

    #_enderecos;

    set enderecos(enderecos) {
        if (!enderecos) {
            this.#_enderecos = undefined;
        } else if (!(enderecos instanceof Array)) {
            throw new TypeError('Objeto de endereço deve ser vazio ou um vetor contendo no máximo dois endereços');
        } else if (endereco.length > 2) {
            throw new Error("Não é permitido atribuir mais de dois endereços ao agendamento");
        }

        if (typeof enderecos == 'object') {
            this.#_enderecos = enderecos.map( endereco => {

                switch (endereco.tipo) {
                    case 'buscar':
                    case 'devolver':
                    case 'buscar-devolver': break;
                    default: throw new TypeError("Tipo para endereço não reconhecido: deve ser 'buscar', 'devolver' ou 'buscar-devolver'");
                }

                if (!endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
                    throw new TypeError('endereco object is missing one or more required properties: logradouro, numero, bairro, cidade or estado');
                }

                return {
                    tipo: endereco.tipo,
                    logradouro: endereco.logradouro,
                    numero: endereco.numero,
                    bairro: endereco.bairro,
                    cidade: endereco.cidade,
                    estado: endereco.estado
                };
            });
        } else {
        }
    }

    get enderecos() {
        return this.#_enderecos;
    }

    async save(connParam) {

    }

    static async find(filter, options) {}

    static fromResultSet(rs) {}

    toJSON() {
        const objJson = {
            id: this.id,
            dtHrMarcada: this.dtHrMarcada,
            servico: { id: this.servico.id },
            funcionario: { id: this.funcionario.id },
            observacoes: this.observacoes,
            pets : this.pets,
            enderecos: this.enderecos
        };

        return objJson;
    }

    toString() {}

}

module.exports = Agendamento;

// TESTES

const objAgend = {
    "idEmpresa": 1,
    "dtHrMarcada": '2025-10-12T112:45:00',
    "servico": { "id": 1 },
    "funcionario": { "id": 10 },
    "observacoes": "Observações para o agendamento",
    "pets" : [
        {
            "id": 5,
            "alimentacao": "racao",
            "remedios": [
                { "id": 10, "nome": "Dipirona", "instrucoes": "depois do almoco" }
            ]
        }
    ],
    "enderecos": [
        {
            "tipo": "buscar",
            "logradouro": "Rua do agendamento",
            "numero": "1234",
            "bairro": "Bairro legal",
            "cidade": "Cidade tal",
            "estado": "ES"
        }
    ]
};

const testeAgend = new Agendamento(objAgend);
console.log(testeAgend.toJSON());
