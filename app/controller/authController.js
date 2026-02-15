const User = require('../model/userModel');
const { hashedPassword, comparePassword } = require('../helper/hashedPassword');
const jwt = require('jsonwebtoken');
const sendEmailVerivicationOTP = require('../helper/sendEmail');
const EmailVerifyModel = require('../model/otpModel');

class AuthController {
    // 1. REGISTER
    async Register(req, res) {
        try {
            const { name, email, password, phone } = req.body;
            if (!name || !email || !password || !phone) {
                return res.status(400).send("All fields are required");
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).send("User already exists");
            }

            const hashpassword = await hashedPassword(password);
            const userdata = new User({
                name,
                email,
                password: hashpassword,
                phone
            });

            const user = await userdata.save();
            await sendEmailVerivicationOTP(req, user);

            // Redirect to the OTP verification page (passing email in query)
            return res.redirect(`/verify-otp?email=${email}`);

        } catch (error) {
            console.log('error', error.message);
            return res.status(500).send("Internal server error");
        }
    }

    // 2. VERIFY EMAIL (OTP)
    async VerifyEmail(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).send("Email and OTP are required");
            }

            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(404).send("Email doesn't exist");
            }

            if (existingUser.is_verified) {
                return res.redirect('/');
            }

            const emailVerification = await EmailVerifyModel.findOne({ userId: existingUser._id, otp });
            
            if (!emailVerification) {
                await sendEmailVerivicationOTP(req, existingUser);
                return res.status(400).send("Invalid OTP, a new one has been sent to your email.");
            }

            // Check Expiry (15 mins)
            const currentTime = new Date();
            const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
            
            if (currentTime > expirationTime) {
                await sendEmailVerivicationOTP(req, existingUser);
                return res.status(400).send("OTP expired, new OTP sent to your email");
            }

            existingUser.is_verified = true;
            await existingUser.save();

            await EmailVerifyModel.deleteMany({ userId: existingUser._id });
            
            // Redirect to login after successful verification
            return res.redirect('/');

        } catch (error) {
            console.error(error);
            res.status(500).send("Unable to verify email");
        }
    }

    // 3. LOGIN
    async Login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).send("All fields are required");
            }

            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(400).send("Email doesn't exist");
            }

            if (!existingUser.is_verified) {
                return res.redirect(`/verify-otp?email=${email}`);
            }

            const isMatch = await comparePassword(password, existingUser.password);
            if (!isMatch) {
                return res.status(400).send("Invalid credentials");
            }

            // Create Token
            const token = jwt.sign({
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // SAVE TOKEN IN COOKIE (Crucial for EJS Dashboard)
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000 // 1 hour
            });

            // Redirect to the Admin Dashboard (Root)
            return res.redirect('/property-list');

        } catch (error) {
            console.log('error', error.message);
            return res.status(500).send("Internal server error");
        }
    }

    // 4. LOGOUT
    async Logout(req, res) {
        res.clearCookie('token');
        return res.redirect('/');
    }

    // 5. RENDERING VIEW METHODS (Helpers)
    renderLoginPage(req, res) { res.render('login'); }
    renderRegisterPage(req, res) { res.render('register'); }
    renderVerifyOtpPage(req, res) { 
        const email = req.query.email || "";
        res.render('verifyOtp', { email }); 
    }
}

module.exports = new AuthController();