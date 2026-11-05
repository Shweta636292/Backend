
const Fine = require("../models/fine");
const Borrow = require("../models/borrow");

// Pay a fine
const payFine = async (req, res) => {
    try {
        const { fineId } = req.params;

        const fine = await Fine.findById(fineId);

        if (!fine) {
            return res.status(404).json({
                message: "Fine not found"
            });
        }

        if (fine.status === "paid") {
            return res.status(400).json({
                message: "Fine already paid"
            });
        }

        fine.status = "paid";
        fine.paymentDate = new Date();

        await fine.save();

        res.status(200).json({
            message: "Fine payment recorded successfully",
            fine
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Generate fines for overdue books
const generateFines = async (req, res) => {
    try {
        const overdueRecords = await Borrow.find({
            status: "borrowed",
            dueDate: { $lt: new Date() }
        });

        let generatedCount = 0;

        for (const borrow of overdueRecords) {
            const difference =
                new Date() - new Date(borrow.dueDate);

            const overdueDays = Math.max(
                0,
                Math.ceil(difference / (1000 * 60 * 60 * 24))
            );

            const amount = overdueDays * 5;

            if (amount <= 0) {
                continue;
            }

            const existingFine = await Fine.findOne({
                borrow: borrow._id
            });

            if (existingFine) {
                if (existingFine.status === "unpaid") {
                    existingFine.amount = amount;
                    await existingFine.save();
                }

                continue;
            }

            await Fine.create({
                borrow: borrow._id,
                user: borrow.borrower,
                amount,
                status: "unpaid"
            });

            generatedCount++;
        }

        res.status(200).json({
            message: "Fine generation completed",
            generatedCount
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get all fines
const getAllFines = async (req, res) => {
    try {
        const fines = await Fine.find()
            .populate("user", "name email")
            .populate("borrow");

        res.status(200).json({
            count: fines.length,
            fines
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get all unpaid fines
const getUnpaidFines = async (req, res) => {
    try {
        const fines = await Fine.find({
            status: "unpaid"
        })
            .populate("user", "name email")
            .populate("borrow");

        const totalUnpaidAmount = fines.reduce(
            (total, fine) => total + fine.amount,
            0
        );

        res.status(200).json({
            count: fines.length,
            totalUnpaidAmount,
            fines
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    payFine,
    generateFines,
    getAllFines,
    getUnpaidFines
};
