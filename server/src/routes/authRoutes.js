const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const User = require("../models/User");

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
