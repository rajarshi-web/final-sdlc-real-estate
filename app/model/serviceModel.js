const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconClass: { type: String, required: true } // For Font Awesome icons
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);