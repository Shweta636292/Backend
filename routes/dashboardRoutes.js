const express=require("express");
const router=express.Router();
const {getDashboaredStatus}=require("../controllers/dashboardController")
const authmiddleware=require("../middleware/authmiddleware")
const authorizeRole=require("../middleware/authorizeRole")

router.get("/status",authmiddleware,authorizeRole("librarian"),
getDashboaredStatus)
module.exports=router;