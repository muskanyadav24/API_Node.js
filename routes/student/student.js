const express = require("express");
const router = express.Router();

const {studentController} = require("../../controllers/student/studentController");
const {authMiddle, authorized} = require("../../middlewares/authMiddlewares/authMiddle");

router.get("/dashboard", authMiddle, authorized(["admin", "teacher", "student"]), studentController)

module.exports = router;