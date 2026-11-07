
const mongoose = require("mongoose");
const Book = require("../models/book");

// CREATE BOOK
const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            category,
            quantity,
            publishedYear,
            coverImage
        } = req.body;

        if (
            typeof title !== "string" || !title.trim() ||
            typeof author !== "string" || !author.trim() ||
            typeof category !== "string" || !category.trim() ||
            quantity === undefined || quantity === null
        ) {
            return res.status(400).json({
                message: "Title, author, category and quantity are required"
            });
        }

        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                message: "Quantity must be a non-negative integer"
            });
        }

        if (
            coverImage !== undefined &&
            typeof coverImage !== "string"
        ) {
            return res.status(400).json({
                message: "Cover image must be a valid URL string"
            });
        }

        if (
            coverImage &&
            !/^https?:\/\/\S+$/i.test(coverImage.trim())
        ) {
            return res.status(400).json({
                message: "Cover image must be a valid HTTP or HTTPS URL"
            });
        }

        const newBook = await Book.create({
            title: title.trim(),
            author: author.trim(),
            category: category.trim(),
            quantity,
            ...(publishedYear !== undefined && { publishedYear }),
            coverImage: coverImage ? coverImage.trim() : ""
        });

        return res.status(201).json({
            message: "Book added successfully",
            book: newBook
        });

    } catch (error) {
        return res.status(400).json({
            message: "Error while adding book",
            error: error.message
        });
    }
};


// GET ALL BOOKS
const getAllBooks = async (req, res) => {
    try {
        const { search, category } = req.query;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 5);
        const skip = (page - 1) * limit;

        let filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            filter.category = {
                $regex: `^${category}$`,
                $options: "i"
            };
        }

        const books = await Book.find(filter)
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments(filter);

        return res.status(200).json({
            page,
            totalBooks,
            limit,
            totalPages: Math.ceil(totalBooks / limit),
            books
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


// GET BOOK BY ID
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Book ID is invalid"
            });
        }

        const bookData = await Book.findById(id);

        if (!bookData) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(bookData);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE BOOK
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Book ID is invalid"
            });
        }

        const {
            title,
            author,
            category,
            quantity,
            publishedYear,
            coverImage
        } = req.body;

        const allowedFields = [
            "title",
            "author",
            "category",
            "quantity",
            "publishedYear",
            "coverImage"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Please provide at least one valid field to update"
            });
        }

        if (title !== undefined &&
            (typeof title !== "string" || !title.trim())) {
            return res.status(400).json({
                message: "Title must be a non-empty string"
            });
        }

        if (author !== undefined &&
            (typeof author !== "string" || !author.trim())) {
            return res.status(400).json({
                message: "Author must be a non-empty string"
            });
        }

        if (category !== undefined &&
            (typeof category !== "string" || !category.trim())) {
            return res.status(400).json({
                message: "Category must be a non-empty string"
            });
        }

        if (quantity !== undefined &&
            (!Number.isInteger(quantity) || quantity < 0)) {
            return res.status(400).json({
                message: "Quantity must be a non-negative integer"
            });
        }

        if (coverImage !== undefined) {
            if (typeof coverImage !== "string") {
                return res.status(400).json({
                    message: "Cover image must be a URL string"
                });
            }

            if (
                coverImage.trim() &&
                !/^https?:\/\/\S+$/i.test(coverImage.trim())
            ) {
                return res.status(400).json({
                    message: "Cover image must be a valid HTTP or HTTPS URL"
                });
            }

            updates.coverImage = coverImage.trim();
        }

        if (updates.title !== undefined) {
            updates.title = updates.title.trim();
        }

        if (updates.author !== undefined) {
            updates.author = updates.author.trim();
        }

        if (updates.category !== undefined) {
            updates.category = updates.category.trim();
        }

        const bookData = await Book.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!bookData) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json({
            message: "Book updated successfully",
            book: bookData
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


// DELETE BOOK
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Book ID is invalid"
            });
        }

        const bookData = await Book.findByIdAndDelete(id);

        if (!bookData) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
};
