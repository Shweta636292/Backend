const Book=require("../models/book");
const Barrow=require("../controllers/barrow");

const calculateFine=(dueDate,checkDate)=>{
     const difference = checkDate - new Date(dueDate);

    const overdueDays = Math.max(
        0,
        Math.ceil(difference / (1000 * 60 * 60 * 24))
    );

    const finePerDay = 5;

    return {
        overdueDays,
        fine: overdueDays * finePerDay
    };
};


const barrowBook=async(req,res)=>{
    try{
        const {BookId}=req.body;
        if(!bookId){
            return res.status(400).json({
                message:"book id required"
            })
        }
        const book=await Book.findById(bookId)
        if(!book){
            return res.status(404).json({
                message:"book not found"
            })
        }
        if(book.quantity<=0){
            return res.status(400).json({
               message:"book unavailable"
            })
        }
        //setting due date
        const dueDate=new Date();
        dueDate.setDate(dueDate.getDate()+14);

        const barrow=await Barrow.create({
             book: book._id,
            borrower: req.user.userId,
            dueDate
        });

        // Reduce available quantity
        book.quantity -= 1;
        await book.save();

        res.status(201).json({
            message: "Book borrowed successfully",
            borrow
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const returnBook=async(req,res)=>{
    try{
        const{bookId}=req.params;
        const barrow=await Barrow.findById(barrowId)
        if(!barrowId){
            return res.status(400).json({
               message:"borrow record not found"
            });
        }
        if(barrow.barrower.toString()!==req.user.userId){
            return res.status(403).json({
                message:"u cannot return someones book"
            })
        }
        if(barrow.status==="return"){
            return res.status(400).json({
                message:"book already returned"
            })
        }
        const book=await findById(barrow.book);

        if(!book){
            return res.status(404).json({
                message:"book not found"
            });
        }
        barrow.status="returned";
        barrow.returnDate=newDate();
         book.quantity += 1;

        await borrow.save();
        await book.save();

        res.status(200).json({
            message: "Book returned successfully",
            borrow
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// Get my borrowed books
const getMyBorrowedBooks = async (req, res) => {
    try {
        const borrowedBooks = await Borrow.find({
            borrower: req.user.userId
        }).populate("book", "title author");

        res.status(200).json({
            count: borrowedBooks.length,
            borrowedBooks
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const bookWithFine=this.getMyBarrowedBooks.map((barrow)=>{
    const checkDate=barrow.returnDate||newDate();

   
     const { overdueDays, fine } = calculateFine(
        borrow.dueDate,
        checkDate
    );

    return {
        ...borrow.toObject(),
        overdueDays,
        fine
    };
});

        

module.exports = { borrowBook:bookWithFine,returnBook,getMyBarrowedBooks };

        