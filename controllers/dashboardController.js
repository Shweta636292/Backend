const Book=require("../models/book");
const User=require("../models/user");
const Barrow=require("../models/barrow");
const getDashboaredStatus=async(req,res)=>{
    try{
        const totalUsers=await User.countDocumnets();
const totalBooks=await Book.countDocuments();
const bookQuantity=await Book.aggregate([
    {
        $group:{
            _id:null,
      
            totalCopies:{$sum:"$quantity"}
        }
    }
])
const totalCopies=bookQuantity[0]?.totalCopies||0;

const availableCopies=await Book.aggregate([
    {
        $group:{
            _id:null,
            availableCopies:{$sum:"$quantity"}
        }

    }
])

const currentlyBarrowedBooks=await Barrow.countDocuments({
    status:"barrowed"
});
const returnedBooks=await Barrow.countDocuments({
    status:"returned"
})
const overDueBooks=await Barrow.countDocuments({
    status:"barrowed",
    dueDate:{$lt:new Date()}

})
const allBorrowRecords = await Borrow.find();

let totalFines = 0;

allBorrowRecords.forEach((borrow) => {
    const checkDate = borrow.returnDate || new Date();

    const difference = checkDate - new Date(borrow.dueDate);

    const overdueDays = Math.max(
        0,
        Math.ceil(difference / (1000 * 60 * 60 * 24))
    );

    totalFines += overdueDays * 5;
});
res.status(200).json({
    totalUsers,
    totalBooks,
    currentlyBarrowedBooks,
    returnedBooks,
    overDueBooks,
    totalCopies,
    availableCopies:availableCopies,
    totalFines
})

    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }

}
module.exports={getDashboaredStatus}