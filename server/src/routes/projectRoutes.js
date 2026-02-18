const express = require("express");
const router = express();
const authMiddleware = require('../middlewares/authmiddleware');
const { createProject, getProjectsByWorkspace } = require("../controllers/projectController");


router.post('/workspaces/:id/projects', authMiddleware, createProject)
router.get('/workspaces/:id/projects', authMiddleware, getProjectsByWorkspace)

module.exports = router;