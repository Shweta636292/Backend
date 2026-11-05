const express=require("express");
const router=express.Router();
const {getDashboardStats}=require("../controllers/dashboardController")
const authmiddleware=require("../middleware/authmiddleware")
const authorizeRole=require("../middleware/authorizeRole")

router.get("/stats",authmiddleware,authorizeRole("librarian"),
getDashboardStats)
module.exports=router;