const Attendance = require("../../models/attendanceModel");
const { Class } = require("../../models/classModel");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

// welcome message
const myClassesStudent = async (req, res) => {
    try {
        console.log("Welcome to my classes controller")
        const classes = await Class.find({ classStudentsId: req.user._id })
        res.status(200);
        return res.json({ message: "Welcome to my classes controller", classes })
    } catch (err) {
        console.log("Error in my classes controller", err)
        res.status(500);
        return res.json({ message: err.message });
    }
}

const studentController = async (req, res) => {
    try {
        console.log("Welcome to student controller")
        res.status(200);
        return res.json({ message: "Welcome to student controller" })
    } catch (err) {
        console.log("Error in student controller", err)
        res.status(500);
        return res.json({ message: err.message });
    }
}
// create student -> post
const studentcreate = async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body
        if (!firstname || !lastname || !username || !email || !password) {
            console.log("All fields are required");
            res.status(400);
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email })
        if (user) {
            console.log("Student already exists");
            res.status(400);
            return res.json({ message: "Student already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ firstname, lastname, username, email, password: hashedPassword, role: "student" });
        res.status(201);
        console.log("Student created successfully");
        return res.json({ message: "Student created successfully", newUser })

    } catch (err) {
        console.log("Error in student create controller", err)
        res.status(500);
        return res.json({ message: err.message });
    }
}
// view all student -> get
const studentview = async (req, res) => {
    try {
        console.log("Welcome to student view controller");
        const students = await User.find({
            role: "student",
            isDeleted: false
        }).select("-password");

        // console.log("Welcome to student view controller");
        // const students = await User.find({ role: "student" }).select("-password");
        if (!students) {
            console.log("No students found");
            res.status(404);
            return res.json({ message: "No students found" });
        }
        res.status(200);
        console.log("Welcome to student view controller");
        return res.json({ message: "Welcome to student view controller", students });
    } catch (err) {
        console.log("Error in student view controller", err)
        res.status(500);
        return res.json({ message: err.message });
    }
}

// edit or update student -> put
const studentupdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, username, email, password } = req.body;
        if (!firstname || !lastname || !username || !email || !password) {
            console.log("All fields are required");
            res.status(400);
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findById(id);
        if (!user) {
            console.log("Student not found");
            res.status(404);
            return res.json({ message: "Student not found" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(id, { firstname, lastname, username, email, password: hashedPassword }, { new: true });
        res.status(200);
        console.log("Student updated successfully");
        return res.json({ message: "Student updated successfully", updatedUser });
    } catch (err) {
        console.log("Error in student update controller", err);
        res.status(500);
        return res.json({ message: err.message });
    }
}

// delete student -> delete

// delete student -> soft delete
const studentdelete = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id, role: "student", isDeleted: false });
        if (!user) {
            return res.status(404).json({ message: "Student not found" });
        }

        user.isDeleted = true;
        user.deletedAt = new Date();
        await user.save();

        console.log("Student soft deleted successfully");
        return res.status(200).json({
            message: "Student soft deleted successfully",
            deletedUser: user
        });

    } catch (err) {
        console.log("Error in student delete controller", err);
        return res.status(500).json({ message: err.message });
    }
};

// const studentdelete = async (req, res) => {
//     try{
//         const {id} = req.params;
//         const user = await User.findById(id);
//         if(!user){
//             console.log("Student not found");
//             res.status(404);
//             return res.json({ message: "Student not found" });
//         }
//         const deletedUser = await User.findByIdAndDelete(id);
//         res.status(200);
//         console.log("Student deleted successfully");
//         return res.json({ message: "Student deleted successfully", deletedUser });
//     }catch(err){
//         console.log("Error in student delete controller", err);
//         res.status(500);
//         return res.json({ message: err.message });
//     }
// }

const myAttendancePercentage = async (req, res) => {
    try {
        const { month, year } = req.query;

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const records = await Attendance.find({
            studentId: req.user._id,
            date: { $gte: start, $lte: end }
        });

        const totalDays = records.length;
        const presentDays = records.filter(r => r.status === "present").length;

        const percentage = totalDays === 0
            ? 0
            : ((presentDays / totalDays) * 100).toFixed(2);

        return res.status(200).json({
            month,
            year,
            totalDays,
            presentDays,
            absentDays: totalDays - presentDays,
            attendancePercentage: `${percentage}%`
        });

    } catch (err) {
        console.log("Error in myAttendancePercentage", err);
        return res.status(500).json({ message: err.message });
    }
};


module.exports = { myClassesStudent, studentController, studentcreate, studentview, studentupdate, studentdelete, myAttendancePercentage }