import mongoose from "mongoose";
import ActivityLog from "../models/activity.js";
import Comment from "../models/comment.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";

const toId = (value) => {
  if (!value) return "";
  if (value._id) return String(value._id);
  return String(value);
};

const isSameId = (left, right) => toId(left) === toId(right);

const isValidId = (value) => mongoose.isValidObjectId(value);

const notFound = (message) => ({
  ok: false,
  status: 404,
  message,
});

const forbidden = (message = "You are not authorized to access this resource") => ({
  ok: false,
  status: 403,
  message,
});

export const getWorkspaceMemberRole = (workspace, userId) => {
  if (!workspace || !userId) return null;

  if (isSameId(workspace.owner, userId)) {
    return "owner";
  }

  const member = workspace.members?.find((item) => isSameId(item.user, userId));

  return member?.role || null;
};

export const getProjectMemberRole = (project, userId) => {
  if (!project || !userId) return null;

  const member = project.members?.find((item) => isSameId(item.user, userId));

  return member?.role || null;
};

export const canAccessWorkspace = (workspace, userId) =>
  Boolean(getWorkspaceMemberRole(workspace, userId));

export const canMutateWorkspaceResource = (workspace, userId, project = null) => {
  const workspaceRole = getWorkspaceMemberRole(workspace, userId);

  if (!workspaceRole || workspaceRole === "viewer") {
    return false;
  }

  const projectRole = getProjectMemberRole(project, userId);

  if (projectRole === "viewer") {
    return false;
  }

  return true;
};

export const requireWorkspaceAccess = async (workspaceId, userId) => {
  if (!isValidId(workspaceId)) {
    return notFound("Workspace not found");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    return notFound("Workspace not found");
  }

  const role = getWorkspaceMemberRole(workspace, userId);

  if (!role) {
    return forbidden("You are not a member of this workspace");
  }

  return { ok: true, workspace, role };
};

export const requireProjectAccess = async (projectId, userId) => {
  if (!isValidId(projectId)) {
    return notFound("Project not found");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    return notFound("Project not found");
  }

  const access = await requireWorkspaceAccess(project.workspace, userId);

  if (!access.ok) {
    return access;
  }

  return {
    ok: true,
    project,
    workspace: access.workspace,
    workspaceRole: access.role,
    projectRole: getProjectMemberRole(project, userId),
  };
};

export const requireTaskAccess = async (taskId, userId) => {
  if (!isValidId(taskId)) {
    return notFound("Task not found");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return notFound("Task not found");
  }

  const access = await requireProjectAccess(task.project, userId);

  if (!access.ok) {
    return access;
  }

  return {
    ok: true,
    task,
    project: access.project,
    workspace: access.workspace,
    workspaceRole: access.workspaceRole,
    projectRole: access.projectRole,
  };
};

export const requireTaskMutationAccess = async (taskId, userId) => {
  const access = await requireTaskAccess(taskId, userId);

  if (!access.ok) {
    return access;
  }

  if (!canMutateWorkspaceResource(access.workspace, userId, access.project)) {
    return forbidden("You are not authorized to modify this resource");
  }

  return access;
};

export const requireCommentAccess = async (commentId, userId) => {
  if (!isValidId(commentId)) {
    return notFound("Comment not found");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return notFound("Comment not found");
  }

  const access = await requireTaskAccess(comment.task, userId);

  if (!access.ok) {
    return access;
  }

  return { ok: true, comment, ...access };
};

export const requireActivityResourceAccess = async (resourceId, userId) => {
  if (!isValidId(resourceId)) {
    return notFound("Activity not found");
  }

  const activity = await ActivityLog.findOne({ resourceId });

  if (activity) {
    switch (activity.resourceType) {
      case "Workspace":
        return requireWorkspaceAccess(resourceId, userId);
      case "Project":
        return requireProjectAccess(resourceId, userId);
      case "Task":
        return requireTaskAccess(resourceId, userId);
      case "Comment":
        return requireCommentAccess(resourceId, userId);
      default:
        return forbidden();
    }
  }

  const workspace = await Workspace.findById(resourceId);
  if (workspace) {
    return requireWorkspaceAccess(resourceId, userId);
  }

  const project = await Project.findById(resourceId);
  if (project) {
    return requireProjectAccess(resourceId, userId);
  }

  const task = await Task.findById(resourceId);
  if (task) {
    return requireTaskAccess(resourceId, userId);
  }

  const comment = await Comment.findById(resourceId);
  if (comment) {
    return requireCommentAccess(resourceId, userId);
  }

  return notFound("Activity not found");
};

export const sendAuthError = (res, access) =>
  res.status(access.status).json({ message: access.message });
