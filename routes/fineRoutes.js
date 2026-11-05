const express=require("express");
const router=express.Router();
const{payFine,generateFines,getAllFines,getUnpaidFines}=require("../controllers/fineController");
const authMiddleware=require("../middleware/authmiddleware")
const authorizeRole=require("../middleware/authorizeRole")

router.put("/fines/:fineId",authMiddleware,authorizeRole(["librarian"]),payFine);
router.get(
    "/",
    authMiddleware,
    authorizeRole("librarian"),
    getAllFines
);
router.get(
    "/unpaid",
    authMiddleware,
    authorizeRole("librarian"),
    getUnpaidFines
);
router.post("/fines/generate",authMiddleware,authorizeRole(["librarian"]),generateFines);
module.exports=router;