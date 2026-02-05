const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    }, // 6th, 7th
    section: {
        type: String,
        required: true
    },    // A, B

    // students
    studentsId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    subjectsId: {
        type: mongoose.Schema.ObjectId,
        ref: "Subject"
    },
    teacherId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Class", classSchema);
