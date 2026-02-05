const User = require("../../models/userModel");
const TeacherAssign = require("../../models/teacherModel");
const Attendance = require("../../models/attendanceModel");
const bcrypt = require("bcrypt")

// Welcome message
const teacherController = async (req, res) => {
    try {
        console.log("Welcome to teacher controller")
        res.status(200);
        return res.json({ message: "Welcome to teacher controller" })
    } catch (err) {
        console.log("Error in teacher controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

const teachercreate = async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body
        if (!firstname || !lastname || !username || !email || !password) {
            console.log("All fields are required");
            res.status(400);
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email })
        if (user) {
            console.log("Teacher already exists");
            res.status(400);
            return res.json({ message: "Teacher already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ firstname, lastname, username, email, password: hashedPassword, role: "teacher" });
        res.status(201);
        console.log("Teacher created successfully");
        return res.json({ message: "Teacher created successfully", newUser })

    } catch (err) {
        console.log("Error in teacher create controller", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

// view all teacher -> get
const teacherview = async (req, res) => {
    try {
        console.log("Welcome to teacher view controller");
        const teachers = await User.find({ role: "teacher", isDeleted: { $ne: true } }).select("-password");
        if (!teachers || teachers.length === 0) {
            console.log("No teachers found");
            res.status(404);
            return res.json({ message: "No teachers found" });
        }
        res.status(200);
        console.log("Welcome to teacher view controller");
        return res.json({ message: "Welcome to teacher view controller", teachers });
    } catch (err) {
        console.log("Error in teacher view controller", err)
        res.status(500);
        return res.json({ message: err.message });
    }
}

// edit or update teacher -> put
const teacherupdate = async (req, res) => {
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
            console.log("Teacher not found");
            res.status(404);
            return res.json({ message: "Teacher not found" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(id, { firstname, lastname, username, email, password: hashedPassword }, { new: true });
        res.status(200);
        console.log("Teacher updated successfully");
        return res.json({ message: "Teacher updated successfully", updatedUser });
    } catch (err) {
        console.log("Error in teacher update controller", err);
        res.status(500);
        return res.json({ message: err.message });
    }
}

// soft delete teacher -> delete
const teacherdelete = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id, role: "teacher", isDeleted: false });
        if (!user) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        user.isDeleted = true;
        user.deletedAt = new Date();
        await user.save();

        console.log("Teacher soft deleted successfully");
        return res.status(200).json({
            message: "Teacher soft deleted successfully",
            deletedUser: user
        });

    } catch (err) {
        console.log("Error in teacher delete controller", err);
        return res.status(500).json({ message: err.message });
    }
};

// delete teacher -> delete
// const teacherdelete = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findById(id);
//         if (!user) {
//             console.log("Teacher not found");
//             res.status(404);
//             return res.json({ message: "Teacher not found" });
//         }
//         const deletedUser = await User.findByIdAndDelete(id);
//         res.status(200);
//         console.log("Teacher deleted successfully");
//         return res.json({ message: "Teacher deleted successfully", deletedUser });
//     } catch (err) {
//         console.log("Error in teacher delete controller", err)
//         res.status(500);
//         return res.json({ message: err.message });
//     }
// }

const markAttendance = async (req, res) => {
    try {
        const { studentId, classId, date, status } = req.body;
        const teacherId = req.user.id;

        if (!studentId || !classId || !status) {
            return res.status(400).json({ message: "studentId, classId and status are required" });
        }

        // Check teacher assignment
        const assignment = await TeacherAssign.findOne({ teacherId, classId });
        if (!assignment) {
            return res.status(403).json({ message: "You are not assigned to this class" });
        }

        // Normalize date (same day duplicate avoid)
        const attendanceDate = date ? new Date(date) : new Date();
        attendanceDate.setHours(0, 0, 0, 0);

        // Upsert attendance
        let attendance = await Attendance.findOne({
            studentId,
            classId,
            date: {
                $gte: attendanceDate,
                $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (attendance) {
            attendance.status = status;
            attendance.teacherId = teacherId;
            await attendance.save();
        } else {
            attendance = await Attendance.create({
                studentId,
                classId,
                teacherId,
                date: attendanceDate,
                status
            });
        }

        return res.status(201).json({
            message: "Attendance marked successfully",
            attendance
        });

    } catch (err) {
        console.log("Error in markAttendance", err);
        return res.status(500).json({ message: err.message });
    }
};

// const markAttendance = async (req, res) => {
//     try {
//         const { studentId, classId, date, status } = req.body;
//         const teacherId = req.user.id;

//         if (!studentId || !classId || !status) {
//             return res.status(400).json({ message: "Student, class and status are required" });
//         }

//         // Verify teacher is assigned to this class
//         const assignment = await TeacherAssign.findOne({ teacherId, classId });
//         if (!assignment) {
//             return res.status(403).json({ message: "You are not assigned to this class" });
//         }

//         const attendanceDate = date ? new Date(date) : new Date();
//         // Reset time to start of day for consistency
//         attendanceDate.setHours(0, 0, 0, 0);

//         // Check if attendance already exists for this student, class and day
//         let attendance = await Attendance.findOne({
//             studentId,
//             classId,
//             date: {
//                 $gte: attendanceDate,
//                 $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
//             }
//         });

//         if (attendance) {
//             attendance.status = status;
//             attendance.teacherId = teacherId;
//             await attendance.save();
//         } else {
//             attendance = await Attendance.create({
//                 studentId,
//                 classId,
//                 teacherId,
//                 date: attendanceDate,
//                 status
//             });
//         }

//         return res.status(201).json({ message: "Attendance marked successfully", attendance });
//     } catch (err) {
//         console.log("Error in markAttendance", err);
//         return res.status(500).json({ message: err.message });
//     }
// };

const teacherClasses = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const data = await TeacherAssign.find({ teacherId: req.user.id })
            .populate("classId")
            .populate("subjectId");

        return res.status(200).json(data);
    } catch (err) {
        console.log("Error in teacherClasses", err);
        return res.status(500).json({ message: err.message });
    }
};


module.exports = { teacherController, teachercreate, teacherview, teacherupdate, teacherdelete, teacherClasses, markAttendance }
