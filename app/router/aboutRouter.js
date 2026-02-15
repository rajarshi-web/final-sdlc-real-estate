const express = require('express');
const router = express.Router();
const aboutController = require('../controller/aboutController');
const upload = require('../middleware/uploadMiddleware'); // Your Multer config

// 'mainImage' must match the 'name' attribute in your frontend form/Postman
router.post('/update', upload.single('mainImage'), aboutController.updateAboutData);

// Public route to get the data
router.get('/', aboutController.getAboutData);

module.exports = router;