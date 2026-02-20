const express = require('express')
const authMiddleware = require('../middlewares/authmiddleware')
const { createTask, getTasksByProject } = require('../controllers/taskController')
const router = express.Router()

router.post('/projects/:id/tasks', authMiddleware, createTask)
router.get("/projects/:id/tasks", authMiddleware, getTasksByProject);

module.exports = router;