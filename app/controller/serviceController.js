const Service = require('../model/serviceModel');

// --- VIEW RENDERING ---

// 1. Render the List Page
exports.renderServiceListPage = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.render('serviceList', { services }); 
    } catch (error) {
        res.status(500).send("Error loading services: " + error.message);
    }
};

// 2. Render the Add Form
exports.renderAddServicePage = (req, res) => {
    res.render('addService');
};

// 3. Render the Edit Form
exports.renderEditServicePage = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).send("Service Not Found");
        res.render('editService', { service });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --- ACTIONS (REDIRECTS) ---

// 4. Create Service
exports.createService = async (req, res) => {
    try {
        await Service.create(req.body);
        // This stops the JSON screen and moves the user back to the list
        res.redirect('/services-list'); 
    } catch (error) {
        res.status(400).send("Creation Failed: " + error.message);
    }
};

// 5. Update Service
exports.updateService = async (req, res) => {
    try {
        await Service.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/services-list');
    } catch (error) {
        res.status(400).send("Update Failed: " + error.message);
    }
};

// 6. Delete Service
exports.deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.redirect('/services-list');
    } catch (error) {
        res.status(500).send("Delete Failed: " + error.message);
    }
};

// --- API (JSON Only - Optional) ---
exports.getAllServicesAPI = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};