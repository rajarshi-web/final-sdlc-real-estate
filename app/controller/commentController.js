const mongoose = require('mongoose'); 
const Comment = require('../model/commentModel');

// 1. POST: Leave a Comment
exports.leaveComment = async (req, res) => {
    try {
        const { blogId, name, email, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ success: false, message: "Invalid Blog ID" });
        }

        const newComment = await Comment.create({
            blogId,
            name,
            email,
            comment
        });

        res.status(201).json({ success: true, data: newComment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. GET: Fetch all comments for a specific blog
exports.getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({ blogId, status: true }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. SINGLE: Get one specific comment
exports.getSingleComment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        res.status(200).json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. EDIT: Update a comment message
exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body; // Usually only the text is edited

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

        const updatedComment = await Comment.findByIdAndUpdate(
            id, 
            { comment }, 
            { new: true, runValidators: true }
        );

        if (!updatedComment) return res.status(404).json({ message: "Comment not found" });

        res.status(200).json({ success: true, data: updatedComment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. DELETE: Remove a comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) return res.status(404).json({ message: "Comment not found" });

        res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};