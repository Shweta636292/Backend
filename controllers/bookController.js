
const mongoose = require("mongoose");
const book = require("../models/book");


const createBook = async (req, res) => {
    try {
        const { title, author, category, quantity } = req.body;

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

        if (
            !Number.isInteger(quantity) || quantity < 0
        ) {
            return res.status(400).json({
                message: "Quantity must be a non-negative integer"
            });
        }

        const newBook = await book.create({
            title: title.trim(),
            author: author.trim(),
            category: category.trim(),
            quantity
        });

        res.status(201).json({
            message: "Book added successfully",
            book: newBook
        });

    } catch (error) {
        res.status(400).json({
            message: "Error while adding book",
            error: error.message
        });
    }
};



const getAllBooks = async (req, res) => {
    try {
        const{search,category}=req.query;

        const page=Math.max(1,parseInt(req.query.page)||1);
        const limit=Math.min(50,parseInt(req.query.limit)||5);
        const skip=(page-1)*limit;

        let filter={};
        if(search){
            filter={
                $or:[
                    {title:{$regex:search,$options:"i"}},
                    {author:{$regex:search,$options:"i"}}
                ]
            }
        }
        if(category){
            filter.category={
                $regex:`^${category}$`,
                $options:"i"
            }
        }
        const books = await book.find(filter)
        .skip(skip)
        .limit(limit);

        const totalBooks=await book.countDocuments(filter);
        totalPages:Math.ceil(totalBooks/limit)
        res.status(200).json({
            page,
           totalBooks,
            limit,
            totalPages:Math.ceil(totalBooks/limit),
            books
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};


const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "book id invalid"
            });
        }

        const bookData = await book.findById(id);

        if (!bookData) {
            return res.status(404).json({
                message: "book not found"
            });
        }

        res.status(200).json(bookData);
    } catch (error) {
        res.status(401).json({
            message: "book Id invalid"
        });
    }
};

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, category, quantity } = req.body;

        if (!title && !author && !category && quantity === undefined) {
            return res.status(400).json({
                message: "Please provide at least one field to update"
            });
        }

        if (quantity !== undefined &&
            (!Number.isInteger(quantity) || quantity < 0)) {
            return res.status(400).json({
                message: "Quantity must be a non-negative integer"
            });
        }

        const bookData = await book.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!bookData) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book updated successfully",
            book: bookData
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};





const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "book id invalid"
            });
        }

        const bookData = await book.findByIdAndDelete(id);

        if (!bookData) {
            return res.status(404).json({
                message: "book not found"
            });
        }

        res.status(200).json({
            message: "book deleted succesfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "book id invalid"
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
