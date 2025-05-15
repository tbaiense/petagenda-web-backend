const mysql = require('mysql2/promise');

const config = {
    host: '127.0.0.1',
    user: 'petagenda',
    password: 'petagenda',
};

function setEmpresa(id) {
    if (!Number.isInteger(id)) {
        throw Error('Id de empresa não é inteiro');
    }
    

    this.empresa.database = `${empresa.prefix}${id}`;
}

const dbo = {
    database: 'dbo',
    createConnection: function () {
        return mysql.createConnection({
            database: this.database, 
            ...config
        });
    }
};

const empresa = {
    prefix: 'emp_',
    database: null,
    createConnection: function () {
        if (!this.database) {
            throw Error('Empresa não foi definida para conexão');
        }

        return mysql.createConnection({
            database: this.database, 
            ...config
        });
    }
};
module.exports = { dbo, empresa, setEmpresa };