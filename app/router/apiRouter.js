const express = require('express');
const router = express.Router();
const propertyController = require('../controller/apiController');
const upload = require('../middleware/imageUpload'); // Ensure this is imported

// --- EJS VIEW ROUTES ---
// This is for the "Edit" button in your table
router.get('/edit/:id', propertyController.editPropertyPage);

// --- ACTION ROUTES (For Forms) ---

// CREATE Property (Changed from /create to match your likely form action)
router.post('/add', upload.single('image'), propertyController.createProperty);

// UPDATE Property (Changed from .put to .post and /update to /edit)
// This matches your form action: /api/property/edit/:id
router.post('/edit/:id', upload.single('image'), propertyController.updateProperty);

// DELETE Property
router.get('/delete/:id', propertyController.deleteProperty);

// --- API ROUTES ---
router.get('/all', propertyController.getProperties);
router.get('/single/:id', propertyController.getPropertyById);

module.exports = router;