
const mongoose = require("mongoose");
const book = require("../models/book");


const createBook = async (req, res) => {
    try {
        const { title, author, category, quantity } = req.body;

        if (
            typeof title !== "string" || !title.trim() ||
            typeof author !== "string" || !author.trim() ||
            typeof category !== "string" || !category.trim() ||
            typeof quantity !== "string" || !quantity.trim()
        ) {
            return res.status(400).json({
                message: "all these required"
            });
        }

        if (
            quantity !== undefined &&
            (!Number.isInteger(quantity) || quantity < 0)
        ) {
            return res.status(400).json({
                message: "quantity must be non negative number"
            });
        }

        const newBook = await book.create(req.body);

        res.status(201).json({
            message: "book added succesfully",
            book: newBook
        });
    } catch (error) {
        res.status(400).json({
            message: "error while adding book",
            error: error.message
        });
    }
};


const getAllBooks = async (req, res) => {
    try {
        const{search,category}=req.query;

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
        const books = await book.find(filter);
        res.status(200).json(books);
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

        const bookData = await book.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!bookData) {
            return res.status(404).json({
                message: "book not found"
            });
        }

        res.status(200).json({
            message: "book updated",
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
