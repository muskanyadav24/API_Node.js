const express = require("express");
const router = express.Router();

const { teacherController, teachercreate, teacherview, teacherupdate, teacherdelete, teacherClasses, markAttendance } = require("../../controllers/teacher/teacherConteroller");
const { authMiddle, authorized } = require("../../middlewares/authMiddlewares/authMiddle");

router.get("/dashboard", authMiddle, authorized(["admin", "teacher"]), teacherController);

// CRUD operations

// create teacher -> post
router.post("/tCreate", authMiddle, authorized(["admin"]), teachercreate);

// view all teacher -> get
router.get("/tView", authMiddle, authorized(["admin"]), teacherview);

// edit or update teacher -> put
router.put("/tUpdate/:id", authMiddle, authorized(["admin"]), teacherupdate);

// delete teacher -> delete
router.delete("/tDelete/:id", authMiddle, authorized(["admin"]), teacherdelete);

// teacher dashboard -> get
router.get("/teacher-dashboard", authMiddle, authorized(["teacher"]), teacherClasses);

// mark attendance -> post
router.post("/markAttendance", authMiddle, authorized(["teacher"]), markAttendance);

module.exports = router;
