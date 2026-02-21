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

async function getTasksByProject(req, res) {
  try {
    const projectId = req.params.id;
    const projectExists = await projects.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({
        message: "Project Not Found",
      });
    }
    //console.log(projectExists);
    const workspaceId = projectExists.workspace.toString();
    const workspaceById = await workspace.findById(workspaceId);
    if (!workspaceById) {
      return res.status(404).json({
        message: "Workspace Not Found",
      });
    }
    //console.log(workspaceById);
    const isMember = workspaceById.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }
    const allTasks = await Task.find({
      project: projectId,
    });
    const result = allTasks.map((tasks) => ({
      id: tasks._id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      project: tasks.project,
      createdBy: tasks.createdBy,
    }));
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

async function updateTaskStatus(req, res) {
  try {
    const taskId = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        message: "Status is Required",
      });
    }
    const allowedEnums = ["todo", "in-progress", "done"];
    if (!allowedEnums.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status",
      });
    }
    const tasksExists = await Task.findById(taskId);
    if (!tasksExists) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }
    const projectId = tasksExists.project;
    const projectExists = await projects.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    const workspaceId = projectExists.workspace;
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
    tasksExists.status = status;
    await tasksExists.save();
    return res.status(200).json({
      id: tasksExists._id,
      title: tasksExists.title,
      description: tasksExists.description,
      status: tasksExists.status,
      project: tasksExists.project,
      createdBy: tasksExists.createdBy,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

module.exports = { createTask, getTasksByProject, updateTaskStatus };
