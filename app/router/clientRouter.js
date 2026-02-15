// const express = require('express');
// const router = express.Router();
// const clientController = require('../controller/clientController');
// const upload = require('../middleware/imageUpload');

// // Dashboard View Routes
// router.get('/clients-list', clientController.getClientsPage); // This is the list
// router.get('/client-add', clientController.renderAddClientPage); // This shows the form

// // Action Routes
// router.post('/add', upload.single('image'), clientController.createClient);
// router.get('/delete/:id', clientController.deleteClient);

// // API Routes (Optional)
// router.get('/api/all', clientController.getAllClients);
// router.get('/api/single/:id', clientController.getSingleClient);

// module.exports = router;