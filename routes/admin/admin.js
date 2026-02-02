const express = require("express");
const router = express.Router();

const {adminController, addClass, addSubject, assignTeacher} = require("../../controllers/admin/adminController");
const {authMiddle, authorized} = require("../../middlewares/authMiddlewares/authMiddle");

router.get("/dashboard", authMiddle, authorized(["admin"]) , adminController );

router.post("/add-class", authMiddle, authorized(["admin"]), addClass);

router.post("/add-subject", authMiddle, authorized(["admin"]), addSubject);

router.post("/assign-teacher", authMiddle, authorized(["admin"]), assignTeacher);

module.exports = router;