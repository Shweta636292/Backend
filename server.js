const express=require("express"); //import express
const mongoose=require("mongoose");
const dotenv=require("dotenv");

const bookRouter=require("./routes/bookRoutes")
const authRoutes=require("./routes/authRoutes");
const authMiddleware = require("./middleware/authmiddleware");
const borrowRoutes = require("./routes/borrowRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const fineRoutes=require("./routes/fineRoutes")
const authorizeRole = require("./middleware/authorizeRole");
dotenv.config();
const app=express();
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/borrow", borrowRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/fines", fineRoutes);

//test route
app.get("/",(req,res)=>{
    res.send("hell0");
});
app.get("/api/auth/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Authentication successful",
        user: req.user
    });
});
app.get(
    "/api/librarian",
    authMiddleware,
    authorizeRole("librarian"),
    (req, res) => {
        res.json({ message: "Welcome, librarian!" });
    }
);

app.use("/books",bookRouter);
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