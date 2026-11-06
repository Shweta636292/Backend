
const express = require("express");
const router = express.Router();

const {
    payFine,
    generateFines,
    getAllFines,
    getUnpaidFines
} = require("../controllers/fineController");

const authMiddleware = require("../middleware/authmiddleware");
const authorizeRole = require("../middleware/authorizeRole");

// Get all fines
router.get("/", authMiddleware, authorizeRole("librarian"), getAllFines);

// Get unpaid fines
router.get("/unpaid", authMiddleware, authorizeRole("librarian"), getUnpaidFines);

// Generate fines
router.post("/generate", authMiddleware, authorizeRole("librarian"), generateFines);

// Pay a fine
router.put("/:fineId", authMiddleware, authorizeRole("librarian"), payFine);

module.exports = router;
