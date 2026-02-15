const Client = require("../model/clientModel");
const fs = require("fs");
const path = require("path");

// ==========================================
// 1. EJS VIEW RENDERING METHODS
// ==========================================

// Render the Table List of Clients (Admin Dashboard)
exports.getClientsPage = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }).lean();
    res.render("clientList", {
      title: "Manage Clients",
      footer: "Copyright © Your Website 2026",
      clients,
    });
  } catch (error) {
    res.status(500).send("Error loading clients: " + error.message);
  }
};

// Render the Add Client Form Page
exports.renderAddClientPage = (req, res) => {
  res.render("addClient", {
    title: "Add Client Testimonial",
    footer: "Copyright © Your Website 2026",
  });
};

// Render the Edit Client Page - FIXED TO PREVENT EJS ERRORS

exports.renderEditClientPage = async (req, res) => {
  try {
    const foundClient = await Client.findById(req.params.id).lean();

    if (!foundClient) {
      return res.status(404).send("Client not found");
    }

    // We pass the object. DO NOT add 'title' or 'footer' here
    // just in case they are the ones causing the 'include' conflict.
    res.render("editClient", {
      client: foundClient,
    });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};
// ==========================================
// 2. DATA ACTION METHODS (With Redirects)
// ==========================================

// ADD NEW CLIENT
exports.createClient = async (req, res) => {
  try {
    const { subtitle, title, description, name, role } = req.body;
    const image = req.file ? req.file.filename : null;

    await Client.create({
      subtitle,
      title,
      description,
      name,
      role,
      image,
    });

    res.redirect("/clients-list");
  } catch (error) {
    res.status(400).send("Error creating client: " + error.message);
  }
};

// UPDATE CLIENT
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { subtitle, title, description, name, role } = req.body;

    // IMPROVEMENT: Strip HTML tags from the description before saving
    // This prevents the issue shown in your screenshot
    const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, "").trim();

    let updateData = { 
        subtitle, 
        title, 
        description: cleanDescription, // Use the cleaned text
        name, 
        role 
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await Client.findByIdAndUpdate(id, updateData);
    res.redirect("/clients-list");
  } catch (error) {
    res.status(500).send("Update Failed: " + error.message);
  }
};
// DELETE CLIENT
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client) return res.status(404).send("Client record not found");

    if (client.image) {
      const imagePath = path.join(__dirname, "../../uploads", client.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Client.findByIdAndDelete(id);
    res.redirect("/clients-list");
  } catch (error) {
    res.status(500).send("Delete Failed: " + error.message);
  }
};

// ==========================================
// 3. API METHODS (Optional: For JSON data)
// ==========================================

exports.getAllClients = async (req, res) => {
  try {
    const data = await Client.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleClient = async (req, res) => {
  try {
    const data = await Client.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
