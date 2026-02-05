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
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Subject"
    },
    classes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Class"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  
})

const User = mongoose.model("User", userSchema)

module.exports = User
