const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        default: "admin"
    },
    subjects: {
        type: Array,
        ref: "Subject"
    },
    classes: {
        type: Array,
        ref: "Class"
    },
    // Soft delete fields
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User
