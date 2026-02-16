const workspace = require("../models/workspace");
const mongoose = require("mongoose");

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

async function getUserWorkspaces(req, res) {
  try {
    const userid = req.user._id;
    const userWorkspaces = await workspace.find({
      members: userid,
    });
    //console.log(userWorkspaces);
    const result = userWorkspaces.map((ws) => ({
      id: ws._id,
      name: ws.name,
      owner: ws.owner,
    }));
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function getWorkspaceById(req, res) {
  try {
    const workspaceId = req.params.id;
    const idWorkspaceExists = await workspace.findById(workspaceId);
    if (!idWorkspaceExists) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    const isMember = idWorkspaceExists.members.some(
      (memberId) => memberId.toString() === req.user._id,
    );
    if (!isMember) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    return res.status(200).json({
      id: idWorkspaceExists._id,
      name: idWorkspaceExists.name,
      owner: idWorkspaceExists.owner,
      members: idWorkspaceExists.members,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

module.exports = {
  getUserWorkspaces,
  workspaceController,
  getWorkspaceById,
};
