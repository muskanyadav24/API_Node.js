const express = require("express");
const router = express.Router();

const {teacherController} = require("../../controllers/teacher/teacherConteroller");
const {authMiddle, authorized} = require("../../middlewares/authMiddlewares/authMiddle");

router.get("/dashboard", authMiddle, authorized(["admin", "teacher"]), teacherController)

module.exports = router;