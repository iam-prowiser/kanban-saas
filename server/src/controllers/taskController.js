const projects = require("../models/projects");
const Task = require("../models/Task");
const workspace = require("../models/workspace");

async function createTask(req, res) {
  try {
    const projectId = req.params.id;
    const { title } = req.body;
    console.log(req.body);
    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
    const projectExists = await projects.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({
        message: "Project Not Found",
      });
    }
    const workspaceId = projectExists.workspace.toString();
    const workspaceExists = await workspace.findById(workspaceId);
    if (!workspaceExists) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    const isMember = workspaceExists.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }
    const createTaskNow = await Task.create({
      title: title,
      description: req.body.description,
      project: projectId,
      createdBy: req.user._id,
      status: "todo",
    });
    return res.status(201).json({
      id: createTaskNow._id,
      title: createTaskNow.title,
      description: createTaskNow.description,
      status: createTaskNow.status,
      project: createTaskNow.project,
      createdBy: createTaskNow.createdBy,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

module.exports = createTask;
