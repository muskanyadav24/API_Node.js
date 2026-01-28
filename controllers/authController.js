const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/jwt");

const register = async (req, res) => {
    try{
        const {name, email, password} = req.body
        if(!name || !email || !password){
            console.log("All fields are required");
            res.status(400);
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findOne({email})
        if(user){
            console.log("User already exists");
            res.status(400);
            return res.json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({name, email, password: hashedPassword});
        res.status(201);
        return res.json({ message: "User created successfully", newUser })

    }catch(err){
        console.log("Error in register controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            console.log("All fields are required");
            res.status(400);
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findOne({email})
        if(!user){
            console.log("User does not exist");
            res.status(400);
            return res.json({ message: "User does not exist" });
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched){
            console.log("Password does not match");
            res.status(400);
            return res.json({ message: "Invalid credentials" });
        }
        const token = generateToken({id: user._id, role: user.role});
        res.status(200);
        return res.json({ message: "User logged in successfully", user, token });

    }catch(err){
        console.log("Error in login controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}
module.exports = { register, login }