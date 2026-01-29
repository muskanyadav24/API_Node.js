const express = require("express");
const router = express.Router();

const {adminController} = require("../../controllers/admin/adminController");
const {authMiddle, authorized} = require("../../middlewares/authMiddlewares/authMiddle");

router.get("/dashboard", authMiddle, authorized(["admin"]) , adminController );

module.exports = router;
