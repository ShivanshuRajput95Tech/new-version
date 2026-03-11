// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/upload");

// Serve uploaded files statically
router.use("/files", express.static(path.join(__dirname, "../uploads")));

// Single file upload
router.post("/single", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/api/uploads/files/${req.file.filename}`;
    const relativePath = path.relative(path.join(__dirname, "../uploads"), req.file.path);

    res.json({
        success: true,
        file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: fileUrl,
            path: relativePath
        }
    });
});

// Multiple files upload
router.post("/multiple", upload.array("files", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    const files = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/api/uploads/files/${file.filename}`,
        path: path.relative(path.join(__dirname, "../uploads"), file.path)
    }));

    res.json({
        success: true,
        files: files,
        count: files.length
    });
});

// Image upload with thumbnail generation
router.post("/image", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
        // Delete the uploaded file if it's not an image
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Only image files are allowed" });
    }

    const fileUrl = `/api/uploads/files/${req.file.filename}`;

    res.json({
        success: true,
        image: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: fileUrl,
            thumbnailUrl: fileUrl // For now, same as main image
        }
    });
});

// Voice message upload
router.post("/voice", upload.single("audio"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    if (!req.file.mimetype.startsWith("audio/")) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Only audio files are allowed" });
    }

    const fileUrl = `/api/uploads/files/${req.file.filename}`;

    res.json({
        success: true,
        audio: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: fileUrl,
            duration: req.body.duration || null
        }
    });
});

// Delete uploaded file
router.delete("/files/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true, message: "File deleted successfully" });
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

// Get file info
router.get("/files/:filename/info", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        res.json({
            filename: filename,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
        });
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

module.exports = router;