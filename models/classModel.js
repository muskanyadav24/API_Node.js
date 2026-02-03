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
    }
});

module.exports = mongoose.model("Class", classSchema);

// const mongoose = require("mongoose");

// const Class = new mongoose.Schema({
//   className: {
//         type: String,
//         required: true
//     }, // 6th, 7th
//   section: {
//         type: String,
//         required: true
//     },    // A, B
// }, { timestamps: true });

// module.exports = mongoose.model("Class", Class);
