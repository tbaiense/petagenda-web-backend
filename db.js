const mysql = require('mysql2/promise');
const os = require('node:os');
const fs = require('node:fs/promises');
const path = require('node:path');
const shell = require('node:child_process');
const appPath = require('./path');

const { SQL_DIR, SQL_TMP_DIR } = require('./path');

const EMPRESA_SCHEMA_BASE_SCRIPT = path.join(SQL_DIR, 'empresa_schema.sql')

if (!appPath.MYSQL_CLIENT_EXEC_PATH) {
    console.error('Caminho do executável do cliente do MySQL não foi definido!');
    throw new Error("MySQL client executable PATH not defined");
}

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
    createSchema: async function (idEmpresa) {
        if (!Number.isInteger(idEmpresa)) {
            throw new TypeError('id de empresa deve ser inteiro para criar schema');
        }

        const plat = os.platform();
        let baseScriptHandle;
        let newScriptHandle;
        let errorObj;
        try {
            // Lendo script de criação de SCHEMA
            baseScriptHandle = await fs.open(EMPRESA_SCHEMA_BASE_SCRIPT, 'r');
            const baseScriptContent = await fs.readFile(baseScriptHandle, 'utf8');
    
            // Alterando arquivo para criar SCHEMA de acordo com ID da empresa
            const newScriptContent = baseScriptContent.replace(/emp_\?/g, `${this.prefix}${idEmpresa}`);

            // Salvando script temporáriamente
            const EMPRESA_SCHEMA_NEW_SCRIPT = path.join(SQL_TMP_DIR, `${idEmpresa}.sql`);
    
            newScriptHandle = await fs.open(EMPRESA_SCHEMA_NEW_SCRIPT, 'w');
            await fs.writeFile(newScriptHandle, newScriptContent);
    
            const mysqlPath = appPath.MYSQL_CLIENT_EXEC_PATH ?? 'mysql';
            let cmd;
            if (plat == 'linux') {
                cmd = shell.spawnSync(mysqlPath, ['-u', config.user, `-p${config.password}`, '-h', config.host, '--default-character-set=utf8mb4','-e', `source ${EMPRESA_SCHEMA_NEW_SCRIPT}`]);
            } else if (plat == 'win32') {
                cmd = shell.spawnSync(mysqlPath, ['-u', config.user, `-p${config.password}`, '-h', config.host, '--default-character-set=utf8mb4', '-e', `source ${EMPRESA_SCHEMA_NEW_SCRIPT}`]);
            } else {
                throw new Error("Erro ao criar schema de empresa: Sistema operacional não suportado pelo back-end");
            }
            
            await fs.unlink(EMPRESA_SCHEMA_NEW_SCRIPT);
            if (cmd.status) {
                throw new Error('Falha ao executar comando de criação de SCHEMA de empresa: verifique o PATH do cliente MySQL e tente novamente');
            }
        } catch (err) {
            errorObj = err;
        } finally {
            baseScriptHandle?.close();
            newScriptHandle?.close();
        }

        if (errorObj) {
            throw errorObj;
        }
    },
    createConnection: async function (empConfig) {
        if (!empConfig) {
            throw new Error('empConfig parameter must be an object containing the id of empresa');
        }

        const { 
            id // id da empresa para encontrar o schema
        } = empConfig;

        if (id == null || id == undefined) {
            throw Error('Empresa não foi definida para conexão');
        }

        if (!Number.isInteger(id)) {
            throw new TypeError('id property of empConfig must be an integer');
        }

        const connConfigs = {
            database: `${this.prefix}${id}`, 
            ...config
        };

        let conn;
        try {
            conn = await mysql.createConnection(connConfigs);
        } catch (err) {
            throw new Error("Falha ao conectar com o banco de dados");
        }

        try {
            await conn.execute(`CALL dbo.set_empresa_atual(${id})`);
            return conn;
        } catch (err) {
            conn.end();
            throw err;
        }
    }
};
module.exports = { dbo, empresa };