const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware");
const { authController } = require("../controller");

router.post("/register", authController.register);

router.post("/login", authController.login);

module.exports = router;
