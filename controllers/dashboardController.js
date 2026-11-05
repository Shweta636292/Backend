
const Book = require("../models/book");
const User = require("../models/user");
const Borrow = require("../models/borrow");
const Fine = require("../models/fine");

const getDashboardStats = async (req, res) => {
    try {
        // 1. Total users
        const totalUsers = await User.countDocuments();

        // 2. Total different book records
        const totalBooks = await Book.countDocuments();

        // 3. Calculate total physical book copies
        const bookQuantity = await Book.aggregate([
            {
                $group: {
                    _id: null,
                    totalCopies: { $sum: "$quantity" }
                }
            }
        ]);

        const totalCopies = bookQuantity[0]?.totalCopies || 0;

        // 4. Available copies
        // In this project, quantity stores available copies.
        const availableCopies = totalCopies;

        // 5. Borrowing statistics
        const currentlyBorrowedBooks = await Borrow.countDocuments({
            status: "borrowed"
        });

        const returnedBooks = await Borrow.countDocuments({
            status: "returned"
        });

        const overdueBooks = await Borrow.countDocuments({
            status: "borrowed",
            dueDate: { $lt: new Date() }
        });

        // 6. Calculate estimated fines from borrow records
        const allBorrowRecords = await Borrow.find();

        let totalFines = 0;

        allBorrowRecords.forEach((borrow) => {
            const checkDate = borrow.returnDate || new Date();

            const difference =
                checkDate - new Date(borrow.dueDate);

            const overdueDays = Math.max(
                0,
                Math.ceil(difference / (1000 * 60 * 60 * 24))
            );

            totalFines += overdueDays * 5;
        });

        // 7. Fine payment statistics
        const allFines = await Fine.find();

        const paidFines = allFines.filter(
            (fine) => fine.status === "paid"
        );

        const unpaidFines = allFines.filter(
            (fine) => fine.status === "unpaid"
        );

        const totalCollected = paidFines.reduce(
            (total, fine) => total + fine.amount,
            0
        );

        const totalOutstanding = unpaidFines.reduce(
            (total, fine) => total + fine.amount,
            0
        );

        const unpaidFineCount = unpaidFines.length;

        // 8. Send dashboard response
        res.status(200).json({
            totalUsers,
            totalBooks,
            totalCopies,
            availableCopies,
            currentlyBorrowedBooks,
            returnedBooks,
            overdueBooks,
            estimatedFinesFromBorrowRecords: totalFines,
            totalCollected,
            totalOutstanding,
            unpaidFineCount
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getDashboardStats };
