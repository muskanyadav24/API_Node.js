const User = require("../../models/userModel")
const bcrypt = require("bcrypt")

const teacherController = async (req, res) => {
    try{
        console.log("Welcome to teacher controller")
        res.status(200);
        return res.json({ message: "Welcome to teacher controller" })
    }catch(err){
        console.log("Error in teacher controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

const teachercreate = async (req, res) => {
    try{
        const {firstname, lastname, username, email, password} = req.body
        if(!firstname || !lastname || !username || !email || !password){
            console.log("All fields are required");
            res.status(400);
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findOne({email})
        if(user){
            console.log("Teacher already exists");
            res.status(400);
            return res.json({ message: "Teacher already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({firstname, lastname, username, email, password: hashedPassword, role: "teacher"});
        res.status(201);
        console.log("Teacher created successfully");
        return res.json({ message: "Teacher created successfully", newUser })

    }catch(err){
        console.log("Error in teacher create controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

// view all teacher -> get
const teacherview = async (req, res) => {
    try{
        console.log("Welcome to teacher view controller");
        const teachers = await User.find({role: "teacher"}).select("-password");
        if(!teachers){
            console.log("No teachers found");
            res.status(404);
            return res.json({ message: "No teachers found" });
        }
        res.status(200);
        console.log("Welcome to teacher view controller");
        return res.json({ message: "Welcome to teacher view controller", teachers });
    }catch(err){
        console.log("Error in teacher view controller", err)
        res.status(500);
        return res.json({ message: err.message });
    }
}

// edit or update teacher -> put
const teacherupdate = async (req, res) => {
    try{
        const {id} = req.params;
        const {firstname, lastname, username, email, password} = req.body;
        if(!firstname || !lastname || !username || !email || !password){
            console.log("All fields are required");
            res.status(400);
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findById(id);
        if(!user){
            console.log("Teacher not found");
            res.status(404);
            return res.json({ message: "Teacher not found" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(id, {firstname, lastname, username, email, password: hashedPassword}, {new: true});
        res.status(200);
        console.log("Teacher updated successfully");
        return res.json({ message: "Teacher updated successfully", updatedUser });
    }catch(err){
        console.log("Error in teacher update controller", err);
        res.status(500);
        return res.json({ message: err.message });
    }
}

// delete teacher -> delete
const teacherdelete = async (req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        if(!user){
            console.log("Teacher not found");
            res.status(404);
            return res.json({ message: "Teacher not found" });
        }
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200);
        console.log("Teacher deleted successfully");
        return res.json({ message: "Teacher deleted successfully", deletedUser });
    }catch(err){
        console.log("Error in teacher delete controller", err)
        res.status(500);
        return res.json({ message: err.message });
    }
}

module.exports = {teacherController, teachercreate, teacherview, teacherupdate, teacherdelete}