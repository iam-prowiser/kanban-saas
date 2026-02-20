const express = require('express')
const authMiddlware = require('../middlewares/authmiddleware')
const createTask = require('../controllers/taskController')
const router = express.Router()

router.post('/projects/:id/tasks', authMiddlware, createTask)

module.exports = router;