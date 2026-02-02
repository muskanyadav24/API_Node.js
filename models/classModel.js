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
    // classStudents: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // },
    // classSubjects: {
    //     type: Array,
    //     default: []
    // },
    // classTeacher: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // }
});

module.exports = mongoose.model("Class", classSchema);