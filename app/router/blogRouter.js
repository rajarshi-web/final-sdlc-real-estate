const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const upload = require('../middleware/imageUpload'); 

// ==========================================
// EJS VIEW ROUTES (For the Browser)
// ==========================================
router.get('/blogs-admin', blogController.getBlogsPage);
router.get('/blog-add', blogController.renderAddBlogPage);
router.get('/blog-edit/:id', blogController.renderEditBlogPage);

// ==========================================
// API / ACTION ROUTES (For Forms & Requests)
// ==========================================

// Add Blog
router.post('/blog/add', upload.single('image'), blogController.createBlog);

// Get All Blogs
router.get('/blogs', blogController.getBlogs); 

// Get Single Blog
router.get('/blog/:id', blogController.getSingleBlog); 

// Edit Blog (Using POST for EJS compatibility)
router.post('/blog/edit/:id', upload.single('image'), blogController.updateBlog);
router.post('/edit/:id', upload.single('image'), blogController.updateBlog);

// Delete Blog
router.get('/blog/delete/:id', blogController.deleteBlog);

module.exports = router;