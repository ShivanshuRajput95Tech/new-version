// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration for different file types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = uploadsDir;

        // Create subdirectories for organization
        if (file.mimetype.startsWith("image/")) {
            uploadPath = path.join(uploadsDir, "images");
        } else if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) {
            uploadPath = path.join(uploadsDir, "media");
        } else {
            uploadPath = path.join(uploadsDir, "files");
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);
        cb(null, `${basename}-${uniqueSuffix}${extension}`);
    }
});

// File filter for security
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
        // Images
        "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
        // Documents
        "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain", "text/csv",
        // Audio/Video
        "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4",
        "video/mp4", "video/avi", "video/mov", "video/wmv",
        // Archives
        "application/zip", "application/x-rar-compressed", "application/x-7z-compressed"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
};

// Configure multer with limits for large files
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
        files: 10 // Maximum 10 files per upload
    }
});

// Export different upload configurations
module.exports = {
    single: (fieldName) => upload.single(fieldName),
    array: (fieldName, maxCount) => upload.array(fieldName, maxCount || 10),
    fields: (fields) => upload.fields(fields),
    any: () => upload.any()
};