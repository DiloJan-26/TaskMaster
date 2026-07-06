import Project from "../models/project.js";
import Task from "../models/task.js";
import {
  canMutateWorkspaceResource,
  requireProjectAccess,
  requireWorkspaceAccess,
  sendAuthError,
} from "../libs/authorization.js";

const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const access = await requireWorkspaceAccess(workspaceId, req.user._id);

    if (!access.ok) {
      return sendAuthError(res, access);
    }

    if (!canMutateWorkspaceResource(access.workspace, req.user._id)) {
      return res.status(403).json({
        message: "You are not authorized to modify this resource",
      });
    }

    const tagArray = tags ? tags.split(",") : [];

    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      workspace: workspaceId,
      members,
      createdBy: req.user._id,
    });

    access.workspace.projects.push(newProject._id);
    await access.workspace.save();

    return res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const access = await requireProjectAccess(projectId, req.user._id);

    if (!access.ok) {
      return sendAuthError(res, access);
    }

    res.status(200).json(access.project);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const access = await requireProjectAccess(projectId, req.user._id);

    if (!access.ok) {
      return sendAuthError(res, access);
    }

    await access.project.populate("members.user");

    const tasks = await Task.find({
      project: projectId,
      isArchived: false,
    })
      .populate("assignees", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      project: access.project,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { createProject, getProjectDetails, getProjectTasks };
