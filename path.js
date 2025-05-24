const path = require('node:path');
exports.PROFILE_PIC_DIR = path.join(__dirname, 'resources/empresa/profile-pic/');
exports.SERVICO_PIC_DIR = path.join(__dirname, 'resources/empresa/servico-oferecido-pic/');
exports.MYSQL_CLIENT_EXEC_PATH = process.env.MYSQL_CLIENT_EXEC_PATH ?? "C:\\Users\\thiag\\Desktop\\bin\\mysql.exe";
exports.SQL_DIR = path.join(__dirname, '/sql');
exports.SQL_TMP_DIR = path.join(__dirname, '/sql/tmp');