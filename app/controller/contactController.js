const Contact = require("../model/contactSubmissionModel");

// ==========================================
// FOR THE WEBSITE (API - JSON)
// ==========================================
exports.submitContactForm = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Contact({ name, phone, email, subject, message });
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// FOR THE ADMIN DASHBOARD (EJS - Render)
// ==========================================

// Render Messages List Page
exports.renderContactListPage = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.render('contactList', { messages }); 
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};

// Delete Message
exports.deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/contact-list');
  } catch (error) {
    res.status(500).send(error.message);
  }
};