const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const User = require("../models/User");
const authMiddlware = require("../middlewares/authmiddleware");

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddlware, getMe);

module.exports = router;
