const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    // Main Section
    mainTitle: { 
        type: String, 
        default: "Your Trusted Partner in Property" 
    },
    description: { 
        type: String 
    },
    // The main hero image or brand photo
    mainImage: { 
        type: String,
        default: "" 
    },
    customerCount: { 
        type: String, 
        default: "560+" 
    },

    // Timeline/History Section
    journey: [{
        year: { type: String },       
        title: { type: String },      
        description: { type: String },
        image: { type: String } // Optional: Image for a specific year
    }],

    // Skills/Progress Section
    skills: [{
        name: { type: String },       // e.g., "Interior Design"
        percentage: { type: Number }  // e.g., 85
    }]
}, { 
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('About', aboutSchema);