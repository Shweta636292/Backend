
const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },

        borrower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        borrowDate: {
            type: Date,
            default: Date.now
        },

        dueDate: {
            type: Date,
            required: true
        },

        returnDate: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ["borrowed", "returned"],
            default: "borrowed"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Borrow", borrowSchema);
