const express = require('express');
const authMiddleware = require('../middlewares/authmiddleware');
const { workspaceController, getUserWorkspaces, getWorkspaceById } = require('../controllers/workspaceController');
const router = express.Router();

router.post("/", authMiddleware, workspaceController);
router.get("/", authMiddleware, getUserWorkspaces);
router.get("/:id", authMiddleware, getWorkspaceById)


module.exports = router;
