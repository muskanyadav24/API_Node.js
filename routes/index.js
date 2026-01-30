const express = require("express");
const router = express.Router();

const authRoute = require("./auth/authRoute");
const adminRoute = require("./admin/admin");
const teacherRoute = require("./teacher/teacher");
const studentRoute = require("./student/student");

// Auth Routes
router.use("/auth",authRoute); 

// Admin Routes
router.use("/admin",adminRoute); 

// Teacher Routes
router.use("/teacher",teacherRoute);

// Student Routes
router.use("/student",studentRoute); 

module.exports = router;

