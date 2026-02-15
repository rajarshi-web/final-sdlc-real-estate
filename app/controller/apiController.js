const Property = require("../model/propertyModel");

class PropertyController {
  // ==========================================
  // 1. EJS VIEW RENDERING METHODS
  // ==========================================

  async getPropertiesPage(req, res) {
    try {
      const properties = await Property.find().sort({ createdAt: -1 });
      res.render("list", {
        title: "Property Management",
        footer: "Copyright © Your Website 2026", // Added this
        properties,
      });
    } catch (error) {
      res.status(500).send("Error loading properties: " + error.message);
    }
  }

  // Renders the add form page
  async renderAddPage(req, res) {
    try {
      res.render("addproperty", {
        title: "Add New Property",
        footer: "Copyright © Your Website 2026", // Added this
      });
    } catch (error) {
      res.status(500).send("Error loading page: " + error.message);
    }
  }
  // Inside PropertyController.js
  async editPropertyPage(req, res) {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).send("Property not found");

      // Change 'product-edit' to 'editProperty'
      res.render("editProperty", {
        title: "Edit Property",
        property: property,
      });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
  // Renders the edit form page

  // ==========================================
  // 2. DATA ACTION METHODS (With EJS Redirection)
  // ==========================================

  // CREATE (Optimized for Form Submission)
  async createProperty(req, res) {
    try {
      const { title, description, price, address, city, state, country, type } =
        req.body;

      // Basic Validation
      if (!title || !price || !city || !type) {
        return res
          .status(400)
          .send("Missing required fields: Title, Price, City, or Type");
      }

      // Handle image filenames from Multer if present
      const imagePaths = req.files
        ? req.files.map((file) => file.filename)
        : [];

      const propertyData = new Property({
        title,
        description,
        price,
        location: { address, city, state, country },
        propertyType: type.toLowerCase(),
        images: imagePaths,
        createdBy: req.user ? req.user._id : null,
      });

      await propertyData.save();
      res.redirect("/property-list"); // Refresh home page after creation
    } catch (error) {
      console.error("Create Error:", error.message);
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }

  // UPDATE (Optimized for Form Submission)
  async updateProperty(req, res) {
    try {
      const { title, description, price, address, city, state, country, type } =
        req.body;

      // Build the update object carefully
      let updateData = {
        title,
        description,
        price,
        propertyType: type ? type.toLowerCase() : undefined,
      };

      // Update location only if these fields are provided
      updateData.location = {
        address: address || "",
        city: city || "",
        state: state || "",
        country: country || "India", // Default or existing
      };

      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map((file) => file.filename);
      }

      const updated = await Property.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!updated) return res.status(404).send("Property not found");

      // Redirecting to the list as you requested
     res.redirect("/property-list");
    } catch (error) {
      res.status(400).send("Update Failed: " + error.message);
    }
  }

  // DELETE (Optimized for EJS links)
  async deleteProperty(req, res) {
    try {
      await Property.findByIdAndDelete(req.params.id);
      res.redirect("/property-list");
    } catch (error) {
      res.status(400).send("Delete Failed: " + error.message);
    }
  }

  // ==========================================
  // 3. ORIGINAL API METHODS (JSON Responses)
  // ==========================================

  // GET ALL (For API calls/Postman)
  async getProperties(req, res) {
    try {
      const { city, type, minPrice, maxPrice } = req.query;
      let query = {};

      if (city) query["location.city"] = { $regex: city, $options: "i" };
      if (type) query.propertyType = type.toLowerCase();
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const properties = await Property.find(query).populate(
        "createdBy",
        "name email",
      );
      res
        .status(200)
        .json({ success: true, count: properties.length, data: properties });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET SINGLE (For API calls/Postman)
  async getPropertyById(req, res) {
    try {
      const property = await Property.findById(req.params.id).populate(
        "createdBy",
        "name email phone",
      );
      if (!property)
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      res.status(200).json({ success: true, data: property });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
    }
  }
}

module.exports = new PropertyController();
