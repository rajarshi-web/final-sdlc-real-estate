const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    post: { type: String, required: true }, // e.g., "Director"
    image: { 
        type: String, 
        default: "" // This will store the path like 'uploads/filename.jpg'
    }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);