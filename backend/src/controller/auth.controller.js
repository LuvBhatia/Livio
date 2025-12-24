import User from "../models/user.model.js";
import jwt from "jsonwebtoken"; 

export async function signup(req, res) {
    const { email, password, fullName } = req.body;


    try{
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }
        const idx=Math.floor(Math.random()*1000)+1;
        const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            password,
            fullName,
            profilePic:randomAvatar
        })
        const token =jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        })
        res.status(201).json({sucess:true, user:newUser})
       
        

    }catch(error){
        console.log("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
        
export function login(req, res) {
    res.send("Login Route");
}

export function logout(req, res) {
    res.send("Logout Route");
}   