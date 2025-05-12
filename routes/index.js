const app = require('../app');
const usuarioRouter = require('./usuario');

app.use('/usuario', usuarioRouter);

module.exports = router;