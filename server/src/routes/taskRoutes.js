const express = require('express')
const authMiddleware = require('../middlewares/authmiddleware')
const { createTask, getTasksByProject, updateTaskStatus, updateTaskDetails, deleteTask } = require('../controllers/taskController')
const router = express.Router()

router.post('/projects/:id/tasks', authMiddleware, createTask)
router.get("/projects/:id/tasks", authMiddleware, getTasksByProject);
router.patch("/tasks/:id", authMiddleware, updateTaskStatus);
router.patch("/tasks/:id", authMiddleware, updateTaskDetails);
router.delete("/tasks/:id", authMiddleware, deleteTask);

module.exports = router;