const express = require('express');
const router = express.Router();
const faqController = require('../controller/faqController');

// 1. GET all FAQs: http://localhost:5003/api/faqs
router.get('/faqs', faqController.getAllFAQs);

// 2. GET single FAQ by ID: http://localhost:5003/api/faqs/65af...
router.get('/faqs/:id', faqController.getSingleFAQ);


router.post('/faqs/add', faqController.createFAQ);

// 4. DELETE FAQ by ID: http://localhost:5003/api/faqs/65af...
router.delete('/faqs/:id', faqController.deleteFAQ);

module.exports = router;