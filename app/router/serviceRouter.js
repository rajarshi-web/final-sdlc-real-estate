// serviceRouter.js


const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');

router.get('/all', serviceController.getAllServices);
router.get('/sinlge/:id', serviceController.getSingleService);
router.post('/add', serviceController.createService);
router.put('/edit/:id', serviceController.updateService);
router.delete('/delete/:id', serviceController.deleteService);

module.exports = router;