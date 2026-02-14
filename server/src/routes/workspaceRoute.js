const express = require('express');
const authMiddleware = require('../middlewares/authmiddleware');
const { workspaceController, getUserWorkspaces } = require('../controllers/workspaceController');
const router = express.Router();

router.post("/", authMiddleware, workspaceController);
router.get("/", authMiddleware, getUserWorkspaces);


module.exports = router;
