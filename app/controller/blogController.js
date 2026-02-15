const Blog = require('../model/blogModel');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// ==========================================
// 1. EJS VIEW RENDERING METHODS
// ==========================================

// Render the Table List of Blogs
exports.getBlogsPage = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.render('blogList', { 
            title: 'Manage Blogs', 
            footer: 'Copyright © Your Website 2026', 
            blogs 
        });
    } catch (error) {
        res.status(500).send("Error loading blogs: " + error.message);
    }
};

// Render the Add Blog Form
exports.renderAddBlogPage = (req, res) => {
    res.render('addBlog', { 
        title: 'Add New Blog', 
        footer: 'Copyright © Your Website 2026' 
    });
};

// Render the Edit Blog Form
exports.renderEditBlogPage = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send("Blog not found");
        
        res.render('editBlog', { 
            title: 'Edit Blog', 
            footer: 'Copyright © Your Website 2026', 
            blog 
        });
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
};

// ==========================================
// 2. DATA ACTION METHODS (Redirects for Dashboard)
// ==========================================

// CREATE: Add Blog
exports.createBlog = async (req, res) => {
    try {
        const { title, description, author, category } = req.body;
        const image = req.file ? req.file.filename : null;

        await Blog.create({ 
            title, 
            description, 
            author, 
            image,
            category 
        });

        // Redirect to the list view after creation
        res.redirect('/blogs-list'); 
    } catch (error) {
        res.status(500).send("Create Failed: " + error.message);
    }
};

// UPDATE: Edit Blog
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, author, category } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid ID");

        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).send("Blog not found");

        let updateData = { title, description, author, category };

        if (req.file) {
            // Delete old image file if a new one is uploaded
            if (blog.image) {
                const oldImagePath = path.join(__dirname, '../../uploads', blog.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            updateData.image = req.file.filename;
        }

        await Blog.findByIdAndUpdate(id, updateData, { new: true });
        
        res.redirect('/blogs-list');
    } catch (error) {
        res.status(500).send("Update Failed: " + error.message);
    }
};

// DELETE: Remove Blog and File
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) return res.status(404).send("Blog not found");

        // Remove file from disk
        if (blog.image) {
            const imagePath = path.join(__dirname, '../../uploads', blog.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Blog.findByIdAndDelete(id);

        res.redirect('/blogs-list');
    } catch (error) {
        res.status(500).send("Delete Failed: " + error.message);
    }
};

// ==========================================
// 3. API METHODS (Returning JSON)
// ==========================================

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};