const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
});

module.exports = mongoose.model("Subject", subjectSchema);
