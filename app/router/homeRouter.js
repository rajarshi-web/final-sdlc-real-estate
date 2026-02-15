const express = require('express');
const router = express.Router();
const AuthCheck = require('../middleware/authCheck');

// Import Controllers
const propertyController = require('../controller/apiController');
const blogController = require('../controller/blogController');
const clientController = require('../controller/clientController'); 
const faqController = require('../controller/faqController');
const serviceController = require('../controller/serviceController');
const teamController = require('../controller/teamController');
const aboutController = require('../controller/aboutController');
const contactController = require('../controller/contactController');
const authController = require('../controller/authController');

// Import Middleware
const upload = require("../middleware/uploadMiddleware");

// ==========================================
// PROPERTY ROUTES (PROTECTED)
// ==========================================
router.get('/property-list', AuthCheck, propertyController.getPropertiesPage);
router.get('/add-property', AuthCheck, (req, res) => res.render('addProperty'));
router.post('/property-create', AuthCheck, upload.array("images", 10), propertyController.createProperty);
router.get('/property-edit/:id', AuthCheck, propertyController.editPropertyPage);
router.get('/property-delete/:id', AuthCheck, propertyController.deleteProperty);
router.post('/property-update/:id', AuthCheck, upload.array("images", 10), propertyController.updateProperty);

// ==========================================
// BLOG ROUTES (PROTECTED)
// ==========================================
router.get('/blogs-list', AuthCheck, blogController.getBlogsPage);
router.get('/blog-add', AuthCheck, blogController.renderAddBlogPage);
router.post('/blog-create', AuthCheck, upload.single('image'), blogController.createBlog);
router.get('/blog-edit/:id', AuthCheck, blogController.renderEditBlogPage);
router.post('/blog-update/:id', AuthCheck, upload.single('image'), blogController.updateBlog);
router.get('/blog-delete/:id', AuthCheck, blogController.deleteBlog);

// ==========================================
// CLIENT ROUTES (PROTECTED)
// ==========================================
router.get('/clients-list', AuthCheck, clientController.getClientsPage);
router.get('/client-edit/:id', AuthCheck, clientController.renderEditClientPage);
router.post('/client-update/:id', AuthCheck, upload.single('image'), clientController.updateClient);
router.get('/client-delete/:id', AuthCheck, clientController.deleteClient);
router.get('/client-add', AuthCheck, clientController.renderAddClientPage);
router.post('/client-create', AuthCheck, upload.single('image'), clientController.createClient);

// ==========================================
// FAQ ROUTES (PROTECTED)
// ==========================================
router.get('/faq-list', AuthCheck, faqController.renderFaqListPage);
router.get('/faq-add', AuthCheck, (req, res) => res.render('addFaq'));
router.get('/faq-edit/:id', AuthCheck, faqController.renderEditFaqPage);
router.post('/faqs/add', AuthCheck, faqController.createFAQ); 
router.post('/faqs/update/:id', AuthCheck, faqController.updateFAQ); 
router.get('/faqs/delete/:id', AuthCheck, faqController.deleteFAQ);

// ==========================================
// SERVICE ROUTES (PROTECTED)
// ==========================================
router.get('/services-list', AuthCheck, serviceController.renderServiceListPage);
router.get('/service-add', AuthCheck, serviceController.renderAddServicePage);
router.get('/service-edit/:id', AuthCheck, serviceController.renderEditServicePage);
router.post('/services/create', AuthCheck, serviceController.createService);
router.post('/services/update/:id', AuthCheck, serviceController.updateService);
router.get('/services/delete/:id', AuthCheck, serviceController.deleteService);

// ==========================================
// TEAM ROUTES (PROTECTED)
// ==========================================
router.get('/team-list', AuthCheck, teamController.renderTeamListPage);
router.get('/team-add', AuthCheck, teamController.renderAddTeamPage);
router.get('/team-edit/:id', AuthCheck, teamController.renderEditTeamPage);
router.post('/team/create', AuthCheck, upload.single('image'), teamController.addTeamMember);
router.post('/team/update/:id', AuthCheck, upload.single('image'), teamController.updateTeamMember);
router.get('/team/delete/:id', AuthCheck, teamController.deleteMember);

// ==========================================
// CONTENT ROUTES (PROTECTED)
// ==========================================
router.get('/content-list', AuthCheck, aboutController.renderAboutListPage);
router.get('/content-add', AuthCheck, aboutController.renderAddAboutPage);
router.get('/content-edit/:id', AuthCheck, aboutController.renderEditAboutPage);
router.post('/content/create', AuthCheck, upload.single('mainImage'), aboutController.createAboutData);
router.post('/content/update/:id', AuthCheck, upload.single('mainImage'), aboutController.updateAboutData);
router.get('/content/delete/:id', AuthCheck, aboutController.deleteAboutData);

// ==========================================
// CONTACT ROUTES (PROTECTED)
// ==========================================
router.get('/contact-list', AuthCheck, contactController.renderContactListPage);
router.get('/contact/delete/:id', AuthCheck, contactController.deleteMessage);

// ==========================================
// AUTH (UNPROTECTED - Publicly accessible)
// ==========================================
router.get('/', authController.renderLoginPage);
router.get('/register', authController.renderRegisterPage);
router.get('/verify-otp', authController.renderVerifyOtpPage);

// Actions
router.post('/register', authController.Register);
router.post('/verify-email', authController.VerifyEmail);
router.post('/login', authController.Login);
router.get('/logout', authController.Logout);

module.exports = router;