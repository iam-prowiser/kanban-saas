const express = require("express");
const router = express();
const authMiddleware = require('../middlewares/authmiddleware');
const { createProject } = require("../controllers/projectController");


router.post('/workspaces/:id/projects', authMiddleware, createProject)

module.exports = router;