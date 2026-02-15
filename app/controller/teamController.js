const Team = require('../model/teamModel');
const fs = require('fs');
const path = require('path');

// --- VIEW RENDERING ---

// Render List Page
exports.renderTeamListPage = async (req, res) => {
    try {
        const members = await Team.find().sort({ createdAt: -1 });
        res.render('teamList', { members });
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
};

// Render Add Page
exports.renderAddTeamPage = (req, res) => {
    res.render('addTeam');
};

// Render Edit Page
exports.renderEditTeamPage = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) return res.status(404).send("Member not found");
        res.render('editTeam', { member });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --- ACTIONS (REDIRECTS) ---

// Add Member
exports.addTeamMember = async (req, res) => {
    try {
        const { name, post } = req.body;
        const memberData = {
            name,
            post,
            image: req.file ? req.file.filename : "" // Store just filename for easier access
        };
        await Team.create(memberData);
        res.redirect('/team-list');
    } catch (error) {
        res.status(400).send("Creation Failed: " + error.message);
    }
};

// Update Member
exports.updateTeamMember = async (req, res) => {
    try {
        const { name, post } = req.body;
        const member = await Team.findById(req.params.id);
        
        let updateData = { name, post };
        
        if (req.file) {
            // Delete old image if a new one is uploaded
            if (member.image) {
                const oldPath = path.join(__dirname, '../../uploads', member.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateData.image = req.file.filename;
        }

        await Team.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/team-list');
    } catch (error) {
        res.status(400).send("Update Failed: " + error.message);
    }
};

// Delete Member
exports.deleteMember = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (member && member.image) {
            const imagePath = path.join(__dirname, '../../uploads', member.image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
        await Team.findByIdAndDelete(req.params.id);
        res.redirect('/team-list');
    } catch (error) {
        res.status(500).send(error.message);
    }
};