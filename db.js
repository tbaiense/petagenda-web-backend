const mysql = require('mysql2/promise');

const config = {
    host: process.env.PETAGENDA_BACKEND_DB_HOST ?? '127.0.0.1',
    user: process.env.PETAGENDA_BACKEND_DB_USER ?? 'petagenda',
    password: process.env.PETAGENDA_BACKEND_DB_PASSWORD ?? 'petagenda',
    decimalNumbers: true,
    typeCast: function(field, next) {
        if(field.type === 'BIT' && field.length === 1) {
            return (field.string() === '1');
        } else if (field.type === 'DATE' || field.type === 'DATETIME') {
            return field.string();
        } else {
            return next();
        }
    }
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
    createConnection: async function () {
        if (!this.database) {
            throw Error('Empresa não foi definida para conexão');
        }

        const conn = mysql.createConnection({
            database: this.database, 
            ...config
        });

        await conn.execute('CALL dbo.set_empresa_atual(1)');

        return conn;
    }
};
module.exports = { dbo, empresa, setEmpresa };
