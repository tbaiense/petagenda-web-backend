const express = require('express');
const router = express.Router({ mergeParams: true });

const petController = require('../controllers/petController');

router.route('/')
.get(petController.list)
.post(petController.create);

router.route('/:idPet')
.get(petController.info)
.put(petController.update)
.delete(petController.delete);

module.exports = router;
