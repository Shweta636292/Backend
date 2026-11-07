
const Book = require("../models/book");
const Borrow = require("../models/borrow");

// Calculate fine for late returns
const calculateFine = (dueDate, checkDate) => {
    const difference = checkDate - new Date(dueDate);

    const overdueDays = Math.max(
        0,
        Math.ceil(difference / (1000 * 60 * 60 * 24))
    );

    const finePerDay = 5;

    return {
        overdueDays,
        fine: overdueDays * finePerDay
    };
};

// Borrow a book

const borrowBook = async (req, res) => {
    try {
        const { bookId } = req.body;

        // Validate book ID
        if (!bookId) {
            return res.status(400).json({
                message: "Book ID is required"
            });
        }

        // Check whether book exists
        const existingBook = await Book.findById(bookId);

        if (!existingBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Prevent duplicate active borrowing
        const existingBorrow = await Borrow.findOne({
            book: bookId,
            borrower: req.user.userId,
            status: "borrowed"
        });

        if (existingBorrow) {
            return res.status(400).json({
                message: "You have already borrowed this book"
            });
        }

        // Atomically decrease available quantity
        const book = await Book.findOneAndUpdate(
            {
                _id: bookId,
                quantity: { $gt: 0 }
            },
            {
                $inc: { quantity: -1 }
            },
            {
                new: true
            }
        );

        if (!book) {
            return res.status(400).json({
                message: "Book is not available"
            });
        }

        // Set due date to 14 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        const borrow = await Borrow.create({
            book: book._id,
            borrower: req.user.userId,
            dueDate
        });

        res.status(201).json({
            message: "Book borrowed successfully",
            borrow
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Return a borrowed book
const returnBook = async (req, res) => {
    try {
        const { borrowId } = req.params;

        const borrow = await Borrow.findById(borrowId);

        if (!borrow) {
            return res.status(404).json({
                message: "Borrow record not found"
            });
        }

        if (borrow.borrower.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You cannot return someone else's book"
            });
        }

        if (borrow.status === "returned") {
            return res.status(400).json({
                message: "Book already returned"
            });
        }

        const book = await Book.findById(borrow.book);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        borrow.status = "returned";
        borrow.returnDate = new Date();

        book.quantity += 1;

        await borrow.save();
        await book.save();

        res.status(200).json({
            message: "Book returned successfully",
            borrow
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get my borrowed books with fine calculation
const getMyBorrowedBooks = async (req, res) => {
    try {
        const borrowedBooks = await Borrow.find({
            borrower: req.user.userId
        }).populate("book", "title author");

        const booksWithFine = borrowedBooks.map((borrow) => {
            const checkDate = borrow.returnDate || new Date();

            const { overdueDays, fine } = calculateFine(
                borrow.dueDate,
                checkDate
            );

            return {
                ...borrow.toObject(),
                overdueDays,
                fine
            };
        });

        res.status(200).json({
            count: booksWithFine.length,
            borrowedBooks: booksWithFine
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    borrowBook,
    returnBook,
    getMyBorrowedBooks
};
