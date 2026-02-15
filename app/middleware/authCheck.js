const jwt = require('jsonwebtoken');

const AuthCheck = async (req, res, next) => {
    // 1. Get token from Cookies (EJS) or Authorization Header (API/Postman)
    const token = req.cookies.token || req.headers['authorization']?.split(" ")[1];

    // 2. If no token is found, redirect to the root (your Login page)
    if (!token) {
        return res.redirect('/'); 
    }

    try {
        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach user data to request and response locals
        req.user = decoded;
        res.locals.user = decoded; // Now you can use <%= user.name %> in any EJS file
        
        next(); // Proceed to the controller
    } catch (error) {
        // 5. If token is expired or fake, clear it and send back to login
        console.error("Auth Error:", error.message);
        res.clearCookie('token');
        return res.redirect('/');
    }
}

module.exports = AuthCheck;