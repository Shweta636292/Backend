
const express = require("express");
const router = express.Router();

const {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

const authMiddleware = require("../middleware/authmiddleware");
const authorizeRole = require("../middleware/authorizeRole");

// Anyone can view books
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Only librarians can change books
router.post(
    "/",
    authMiddleware,
    authorizeRole("librarian"),
    createBook
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRole("librarian"),
    updateBook
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRole("librarian"),
    deleteBook
);

module.exports = router;

module.exports=router;