const Class = require("../../models/classModel");
const User = require("../../models/userModel");
const TeacherAssign = require("../../models/teacherModel");
const Attendance = require("../../models/attendanceModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// welcome message
const myClassesStudent = async (req, res) => {
    try {
        console.log("Welcome to my classes controller")
        const classes = await Class.find({ classStudentsId: req.user._id, isDeleted: { $ne: true } })
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
        let query = { role: "student", isDeleted: { $ne: true } };

        // Requirement: Teacher can only see students in their classes
        if (req.user.role === "teacher") {
            const assignedClasses = await TeacherAssign.find({ teacherId: req.user._id || req.user.id });
            const classIds = assignedClasses.map(a => a.classId);

            // Assuming students are linked to classes via the 'classes' array in User model
            query.classes = { $in: classIds };
        }

        const students = await User.find(query).select("-password").populate("classes");
        if (!students || students.length === 0) {
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

// soft delete student -> delete
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

// delete student
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

const getAttendancePercentage = async (req, res) => {
    try {
        let studentId = req.user.id || req.user._id;

        if ((req.user.role === "teacher" || req.user.role === "admin") && req.query.studentId) {
            studentId = req.query.studentId;
        }

        if (!studentId) {
            return res.status(400).json({ message: "Student ID not found in token or query" });
        }

        const { month, year } = req.query;
        const now = new Date();

        const m = month ? Number(month) - 1 : now.getMonth();
        const y = year ? Number(year) : now.getFullYear();

        const startOfMonth = new Date(y, m, 1);
        const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59);

        console.log(`Searching attendance for studentId: ${studentId}`);
        console.log(`Date range: ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()}`);

        const attendanceRecords = await Attendance.find({
            studentId: new mongoose.Types.ObjectId(studentId),
            date: { $gte: startOfMonth, $lte: endOfMonth },
            isDeleted: { $ne: true }
        });

        console.log(`Found ${attendanceRecords.length} records`);

        if (attendanceRecords.length === 0) {
            return res.status(200).json({
                message: "No attendance records found for this month",
                percentage: 0,
                totalDays: 0,
                presentDays: 0,
                debug: {
                    studentId,
                    range: { start: startOfMonth, end: endOfMonth }
                }
            });
        }

        const totalDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter(
            a => a.status.toLowerCase() === "present"
        ).length;

        const percentage = ((presentDays / totalDays) * 100).toFixed(2);

        return res.status(200).json({
            message: "Attendance percentage calculated",
            percentage: Number(percentage),
            totalDays,
            presentDays
        });

    } catch (err) {
        console.log("Error in getAttendancePercentage", err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { myClassesStudent, studentController, studentcreate, studentview, studentupdate, studentdelete, getAttendancePercentage }
