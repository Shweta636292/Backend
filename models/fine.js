
const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema(
    {
        borrow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Borrow",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ["unpaid", "paid"],
            default: "unpaid"
        },

        paymentDate: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.Fine || mongoose.model("Fine", fineSchema);
