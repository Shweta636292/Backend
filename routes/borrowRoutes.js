const express=require("express");
const router=express.Router();

const {
    borrowBook,
    returnBook,
    getMyBorrowedBooks
} = require("../controllers/borrowController");
const authMiddleware=require("../middleware/authmiddleware")

router.post("/",authMiddleware,borrowBook)
router.get("/my-books", authMiddleware, getMyBorrowedBooks);
router.put("/:borrowId/return", authMiddleware, returnBook);
module.exports=router;