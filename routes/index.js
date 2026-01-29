const express = require("express");
const router = express.Router();

const authRoute = require("./auth/authRoute");
const adminRoute = require("./admin/admin");
const teacherRoute = require("./teacher/teacher");
const studentRoute = require("./student/student");

router.use("/auth",authRoute); 
router.use("/admin",adminRoute); 
router.use("/teacher",teacherRoute);
router.use("/student",studentRoute); 

module.exports = router;

