const express = require('express');
const router = express.Router();
const teamController = require('../controller/teamController');
const upload = require('../middleware/uploadMiddleware');

// If teamController.addTeamMember is misspelled, it returns undefined -> CRASH
router.post('/add', upload.single('image'), teamController.addTeamMember);
router.get('/all', teamController.getAllMembers);
router.get('/single/:id', teamController.getSingleMember);
router.delete('/delete/:id', teamController.deleteMember);

module.exports = router;