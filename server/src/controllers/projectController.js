const projects = require("../models/projects");
const Projects = require("../models/projects");
const workspace = require("../models/workspace");
const Workspace = require("../models/workspace");
const mongoose = require("mongoose");

async function createProject(req, res) {
  try {
    const workspaceId = req.params.id;
    const { projectName } = req.body;
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({ message: "Invalid workspace id" });
    }
    if (!projectName || projectName.trim() === "") {
      return res.status(400).json({
        message: "Invalid project name",
      });
    }
    const isWorkspacePresent = await Workspace.findById(workspaceId);
    //console.log(isWorkspacePresent);
    if (!isWorkspacePresent) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    const isMember = isWorkspacePresent.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }
    //console.log(req.user);
    const newProject = await Projects.create({
      name: projectName,
      workspace: workspaceId,
      createdBy: req.user._id,
    });
    //console.log(newProject);
    const result = {
      id: newProject._id,
      name: newProject.name,
      workspace: newProject.workspace,
      createdBy: newProject.createdBy,
    };
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

async function getProjectsByWorkspace(req, res) {
  try {
    const workspaceId = req.params.id;
    const workspaceById = await workspace.findById(workspaceId);
    if (!workspaceById) {
      return res.status(404).json({
        message: "Workspace Not Found",
      });
    }
    const isMember = workspaceById.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    const projectsByWorkspaceId = await projects.find({
      workspace: workspaceId,
    });
    const result = projectsByWorkspaceId.map((ws) => ({
      id: ws._id,
      name: ws.name,
      workspace: ws.workspace,
      createdBy: ws.createdBy,
    }));
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

module.exports = {
  createProject,
  getProjectsByWorkspace,
};
