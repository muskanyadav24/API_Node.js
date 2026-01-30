const express = require("express");
const router = express.Router();

const {studentController, studentcreate, studentview, studentupdate, studentdelete} = require("../../controllers/student/studentController");
const {authMiddle, authorized} = require("../../middlewares/authMiddlewares/authMiddle");

router.get("/dashboard", authMiddle, authorized(["admin", "teacher", "student"]), studentController);

// CRUD operations

// create student -> post
router.post("/sCreate", authMiddle, authorized(["admin", "teacher"]), studentcreate);

// view all student -> get
router.get("/sView", authMiddle, authorized(["admin", "teacher"]), studentview);

// edit or update student -> put
router.put("/sUpdate/:id", authMiddle, authorized(["admin", "teacher"]), studentupdate);

// delete student -> delete
router.delete("/sDelete/:id", authMiddle, authorized(["admin"]), studentdelete);

module.exports = router;