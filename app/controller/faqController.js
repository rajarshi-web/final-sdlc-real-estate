const mongoose = require('mongoose');
const FAQ = require('../model/faqModel');

// ==========================================
// DASHBOARD RENDER FUNCTIONS (GET)
// ==========================================

// 1. Render the LIST page
exports.renderFaqListPage = async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ createdAt: -1 });
        res.render('faqList', { faqs }); 
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
};

// 2. Render the EDIT page
exports.renderEditFaqPage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format");
        }

        const faq = await FAQ.findById(id);
        if (!faq) return res.status(404).send("FAQ not found");
        
        res.render('editFaq', { faq }); 
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// ==========================================
// DASHBOARD ACTION FUNCTIONS (POST/GET)
// ==========================================

// 3. Create FAQ (Redirects to List)
exports.createFAQ = async (req, res) => {
    try {
        await FAQ.create(req.body);
        // This stops the JSON from appearing
        res.redirect('/faq-list'); 
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. Update FAQ (Redirects to List)
exports.updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format");
        }

        await FAQ.findByIdAndUpdate(id, req.body);
        res.redirect('/faq-list');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 5. Delete FAQ (Redirects to List)
exports.deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format");
        }

        await FAQ.findByIdAndDelete(id);
        res.redirect('/faq-list');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// ==========================================
// API FUNCTIONS (For Frontend/React use)
// ==========================================

// Get All Active FAQs as JSON
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({ status: true });
        res.status(200).json({
            success: true,
            count: faqs.length,
            data: faqs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single FAQ as JSON
exports.getSingleFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }
        const faq = await FAQ.findById(id);
        if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });
        res.status(200).json({ success: true, data: faq });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};