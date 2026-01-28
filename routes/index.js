// const express = require("express");
// const router = express.Router();
// const dashboardRoute = require("./dashbord/dashboard");

// const { register, login } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);

// router.use(dashboardRoute);

// module.exports = router;

const express = require("express");
const router = express.Router();

const dashboardRoute = require("./dashbord/dashboard");
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.use(dashboardRoute); 

module.exports = router;
