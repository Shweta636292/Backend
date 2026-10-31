
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const user = require("../models/user");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

      
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

       
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

   
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed"
        });
    }
};

const loginUser=async(req,res)=>{
    try{
        const{name,password}=req.body;

        if(!name||!password){
            return res.status(400).json({
                message:"name and password required"
            });
        }
        const user=await user.findOne({
          email:email.toLowecase().trim()
        });

        if(!user){
            return res.status(401).json({
                message:"user not found"
            });
        }
        const isMatch=await bcrypt.compare({
                password,
                user,password
        })
        if(!isMatch){
            return res.status(401).json({
                message:"Invalid password"
            });
        }
        const token=jwt.sign({
            userId:user._id,
            role:user.role
        },
         process.env.JWT_SECRET,
        {expiresIn:"1hr"}
        )
        res.status(200).json({
            message:"succesful login"
        });

        
    }catch(error){
        res.status(500).json({
            message:"login failed"
        })
    }
}

module.exports = { registerUser,loginUser };
