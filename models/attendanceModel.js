const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "present", "absent"],
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
