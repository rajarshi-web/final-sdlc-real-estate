const About = require('../model/aboutModel');
const fs = require('fs');
const path = require('path');

// 1. Render the Table List
exports.renderAboutListPage = async (req, res) => {
    try {
        const contents = await About.find().sort({ createdAt: -1 });
        res.render('aboutList', { contents });
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
};

// 2. Render Add Form
exports.renderAddAboutPage = (req, res) => {
    res.render('aboutAdd');
};

// 3. Create Action
exports.createAboutData = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.mainImage = req.file.filename;
        }
        await About.create(updateData);
        res.redirect('/content-list');
    } catch (error) {
        res.status(400).send("Create Failed: " + error.message);
    }
};

// 4. Render Edit Form
exports.renderEditAboutPage = async (req, res) => {
    try {
        const data = await About.findById(req.params.id);
        res.render('aboutEdit', { data });
    } catch (error) {
        res.status(404).send("Not Found");
    }
};

// 5. Update Action
exports.updateAboutData = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.mainImage = req.file.filename;
        }
        await About.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/content-list');
    } catch (error) {
        res.status(400).send("Update Failed");
    }
};

// 6. Delete Action
exports.deleteAboutData = async (req, res) => {
    try {
        await About.findByIdAndDelete(req.params.id);
        res.redirect('/content-list');
    } catch (error) {
        res.status(500).send(error.message);
    }
};