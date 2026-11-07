
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
            required: true,
            trim: true
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
        },

        coverImage: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Book || mongoose.model("Book", bookSchema);
