// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads'); // Make sure this folder exists
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 8 * 1024 * 1024 }, 
//     fileFilter: (req, file, cb) => {
//         const filetypes = /jpeg|jpg|png|webp|pdf/;
//         const extname = filetypes.test(path.extname(file.originalname).toUpperCase());
//         if (extname) return cb(null, true);
//         cb(new Error("Only images or pdfs are allowed!"));
//     }
// });

// module.exports = upload;
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Ensure this folder exists in your root directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8MB limit
    fileFilter: (req, file, cb) => {
        // 1. Define allowed extensions in lowercase
        const filetypes = /jpeg|jpg|png|webp|pdf/;

        // 2. Extract extension and convert to lowercase for comparison
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        // 3. Check the Mimetype as well (safer)
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            // Updated error message to be more descriptive
            cb(new Error("Error: Only images (jpeg, jpg, png, webp) or pdfs are allowed!"));
        }
    }
});

module.exports = upload;