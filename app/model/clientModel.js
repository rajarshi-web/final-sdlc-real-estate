const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    subtitle: { 
        type: String, 
        default: "WHY WITH US" 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    }, // e.g., "THOMAS"
    role: { 
        type: String, 
        required: true 
    }, 
    image: { 
        type: String, 
        required: true 
    } 
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);