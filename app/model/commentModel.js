const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    comment: { type: String, required: true },
    status: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);