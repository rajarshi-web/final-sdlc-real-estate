const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    author: { type: String, required: true }, 
    image: { type: String, required: false }, 
    category: {type: String, required: false},
    status: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);