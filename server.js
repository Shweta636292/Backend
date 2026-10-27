const express=require("express"); //import express
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const book=require("./models/book");
dotenv.config();
const app=express();
app.use(express.json());

//test route
app.get("/",(req,res)=>{
    res.send("hell0");
});

app.post("/books",async(req,res)=>{
    try{
        const book=await book.create(req.body);
        res.status(201).json({
            message:"book added succesfully",
            book:book
        });

    }catch(error){
        res.status(400).json({
            message:"error while adding book",
            error:error.message
        });
    }
});

app.get("/books",async(req,res)=>{
    try{
        const books=await book.find();
        res.status(200).json(books);
        }catch(error){
            res.status(401).json({
                message:error.message
            });
    }
})

app.get("/books/:id",async(req,res)=>{
    try{
        const book=await book.findById(req.params.id);
        if(!book){
            return res.status(404).json({
                message:"book not found"
            });
        }
        res.status(200).json(book);

    }catch(error){
        res.status(401).json({
            message:"book Id invalid"
        });
    }
});

app.delete("/books/:id",async(req,res)=>{
    try{
        const book=await book.findByIdAndDelete(req.params.id);
        if(!book){
            return res.status(404).json({
                message:"book not found"

            });
        }
        res.status(200).json({
            message:"book deleted succesfully"
        });
    }catch(error){
        res.status(400).json({
            message:"book id invalid"
        });
    }
});

async function startServer(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("db connected");
        app.listen(process.env.PORT||3000,()=>{
            console.log("server running on port 3000");
        });
    }catch(error){
        console.log("db not connected",error.message);
        process.exit(1);
    }
}
startServer();