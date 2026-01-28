const express = require("express");
const router = express.Router();

const {dashboardController} = require("../../controllers/dashboardController");
const {authMiddle} = require("../../middlewares/authMiddlewares/authMiddle");

router.get("/dashboard", authMiddle, dashboardController);

module.exports = router;
