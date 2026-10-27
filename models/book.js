
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        author: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true
        },

        publishedYear: {
            type: Number,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Book", bookSchema);
