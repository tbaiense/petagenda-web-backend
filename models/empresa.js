// Model para entidade Empresa

module.exports = class Empresa {
    #isNew = true;
    #p_id = undefined;
    #p_razaoSocial = undefined;
    #p_cnpj = undefined;
    #p_nomeFantasia = undefined;
    #p_lema = undefined;
    #p_foto = undefined;
    #p_endereco = undefined;

    static find(filter = undefined, options = undefined) {
        if (filter && !(filter instanceof Object)) {
            throw new TypeError('Filter deve ser Object');
        }

        if (options && !(options instanceof Object)) {
            throw new TypeError('Options deve ser Object');
        }

        if (arguments.length == 1) {
            const { id, cnpj } = filter; // Object representando a empresa

            // Buscar no banco empresas
            if (Number.isInteger(id)) { // Buscar por id

            } else { // Buscar todas (máximo 20)

            }

            // Definir empresas recebidas com isNew = false;
        }
    }

    // Cria ou atualiza registro de empresa no banco
    save() {

        // Definir empresa como isNew = false;
    }

    constructor(emp) {
        if (emp instanceof Number) {
            this.id = emp;
        } else {
            console.log(emp);
            const { id, razaoSocial, nomeFantasia, cnpj, foto, lema, endereco } = emp;

            if (id && !Number.isInteger(id)) {
                throw new TypeError('Id da empresa deve ser inteiro');
            }

            this.id = id;

            if (!nomeFantasia || !cnpj) {
                throw new Error("Nome fantasia ou CNPJ não informado");
            }


            this.nomeFantasia = nomeFantasia;
            this.cnpj = cnpj; // TODO: validar CNPJ

            if (razaoSocial) {
                this.razaoSocial = razaoSocial;
            }

            if (lema) {
                this.lema = lema;
            }

            if (foto) {
                this.foto = foto;
            }

            if (endereco) {
                this.endereco = endereco;
            }
        }
    }

    set id(value) {
        if (!this.p_id && Number.isInteger(value)) {
            this.p_id = value;
        }
    }

    get id() {
        return this.p_id;
    }

    set nomeFantasia(value) {
        console.log(value);
        if (typeof value == 'string') {
            this.p_nomeFantasia = value;
        } else {
            throw new TypeError('Nome fantasia deve ser String');
        }
    }

    get nomeFantasia() {
        return this.p_nomeFantasia;
    }

    set razaoSocial(value) {
        if (typeof value == 'string') {
            this.p_razaoSocial = value;
        } else if (!value) {
            this.p_razaoSocial = undefined;
        } else {
            throw new TypeError("Razão social deve ser String");
        }
    }


    get razaoSocial() {
        return this.p_razaoSocial;
    }

    set cnpj(value) { // TODO: Validar CNPJ
        if (typeof value == 'string') {
            this.p_cnpj = value;
        } else {
            throw new TypeError('CNPJ deve ser String');
        }
    }

    get cnpj() {
        return this.p_cnpj;
    }

    set lema(value) {
        if (typeof value == 'string') {
            this.p_lema = value;
        } else if (!value) {
            this.p_lema = undefined;
        } else {
            throw new TypeError("Lema deve ser String");
        }
    }

    get lema() {
        return this.p_lema;
    }

    set foto(value) {
        if (typeof value == 'string') {
            this.p_foto = value;
        } else if (!value) {
            this.p_foto = undefined;
        } else {
            throw new TypeError("Foto deve ser String");
        }
    }

    get foto() {
        return this.p_foto;
    }

    set endereco(value) {
        if (value instanceof Object) {
            const { logradouro, numero, bairro, cidade, estado } = value;

            if (logradouro && typeof logradouro == 'string') {
                this.p_endereco.logradouro = value;
            } else {
                throw new TypeError('Logradouro deve ser String');
            }

            if (numero && typeof numero == 'string') {
                this.p_endereco.numero = value;
            } else {
                throw new TypeError('Número deve ser String');
            }

            if (bairro && typeof bairro == 'string') {
                this.p_endereco.bairro = value;
            }   else {
                throw new TypeError('Bairro deve ser String');
            }

            if (cidade && typeof cidade == 'string') {
                this.p_endereco.cidade = value;
            } else {
                throw new TypeError('Cidade deve ser String');
            }

            if (estado && typeof estado == 'string') {
                this.p_endereco.estado = estado;
            } else {
                throw new TypeError("Estado deve ser String");
            }

        } else if (!value) {
            this.p_endereco = undefined;
        } else {
            throw new TypeError("Endereço deve ser Object");
        }
    }

    get endereco() {
        return this.p_endereco;
    }
};
