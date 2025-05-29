const express = require('express');
const router = express.Router({ mergeParams: true });

const agendamentoController = require('../controllers/agendamentoController');

router.route('/')
.get(agendamentoController.list)
.post(agendamentoController.create);

router.route('/:idAgendamento')
.get(agendamentoController.info)
// .put(agendamentoController.update)
// .delete(agendamentoController.delete);

module.exports = router;
