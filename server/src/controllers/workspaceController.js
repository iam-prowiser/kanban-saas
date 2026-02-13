const workspace = require("../models/workspace");

async function workspaceController(req, res) {
  try {
    //console.log(req.body);
    const { name } = req.body;
    //console.log(name);
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
    const newWorkspace = await workspace.create({
      name: name,
      owner: req.user._id,
      members: [req.user._id],
    });
    return res.status(201).json({
      id: newWorkspace._id,
      name: newWorkspace.name,
      owner: newWorkspace.owner,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = workspaceController;
