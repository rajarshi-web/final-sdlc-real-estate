const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');


//http://localhost:5003/api/comment/add
router.post('/comment/add', commentController.leaveComment);
//http://localhost:5003/api/comments/:id
router.get('/comments/:blogId', commentController.getBlogComments);
router.get('/comment/:id', commentController.getSingleComment);
router.put('/comment/edit/:id', commentController.updateComment);
router.delete('/comment/delete/:id', commentController.deleteComment);

module.exports = router;