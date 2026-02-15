require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Database Connection
const dbCon = require('./app/config/dbCon');

// Router Imports
const authRoute = require('./app/router/authRouter');
const homeRouter = require('./app/router/homeRouter'); 
// Note: apiRoute, faqRoute, blogRoute, etc., are now handled inside homeRouter

const app = express();

// Initialize Database
dbCon();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET || "webskitters",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

app.use((req, res, next) => {
    res.locals.title = "Real Estate Admin";
    res.locals.footer = "Copyright © Your Website 2026";
    next();
});

// Setup EJS
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Static Folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---

// 1. Auth API (Keep this if you use it for login)
app.use('/api', authRoute);

// 2. Dashboard & Actions (This handles Properties, Blogs, Clients, FAQs, and Services)
// This MUST be used to avoid the "Cannot POST" and JSON issues.
app.use('/', homeRouter);

// 3. REMOVED REDUNDANT API ROUTES 
// These were causing the "TypeError: argument handler must be a function" crash


// --- Server Start ---
const PORT = process.env.PORT || 5003; // Using your local port 5003
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});