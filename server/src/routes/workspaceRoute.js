const express = require('express');
const authMiddlware = require('../middlewares/authmiddleware');
const workspaceController = require('../controllers/workspaceController');
const router = express.Router();

router.post("/", authMiddlware, workspaceController);

module.exports = router;
