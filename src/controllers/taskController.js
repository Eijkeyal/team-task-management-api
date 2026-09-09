import taskSchema from "../models/taskSchema.js";
import projectSchema from "../models/projectSchema.js";
import userSchema from "../models/userSchema.js";
import { getIO } from "../socket/socket.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, project } =
      req.body;

    const projectExists = await projectSchema.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const userExists = await userSchema.findById(assignedTo);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    const isMember = projectExists.members.some(
      (member) => member.toString() === assignedTo,
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "Assigned user is not a member of this project",
      });
    }

    const task = await taskSchema.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      project,
      createdBy: req.user._id,
    });

    getIO().to(`user:${assignedTo}`).emit("taskAssigned", {
      message: "A new task has been assigned to you",
      taskId: task._id,
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      project: task.project,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTask = async (req, res) => {
  try {
    const query = {};

    if (req.user.role === "MEMBER") {
      query.assignedTo = req.user._id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.search) {
      query.$or = [
        {
          title: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ];
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

    const skip = (page - 1) * limit;

    const total = await taskSchema.countDocuments(query);

    const tasks = await taskSchema
      .find(query)
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await taskSchema
      .findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      req.user.role === "MEMBER" &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only view your assigned tasks",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    let task = await taskSchema.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      req.user.role === "MEMBER" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your assigned tasks",
      });
    }

    if (req.user.role === "MEMBER") {
      const allowedFields = ["status"];

      const invalidField = Object.keys(req.body).some(
        (field) => !allowedFields.includes(field),
      );

      if (invalidField) {
        return res.status(403).json({
          success: false,
          message: "Members can only update task status",
        });
      }
    }

    const oldStatus = task.status;

    task = await taskSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (req.body.status && req.body.status !== oldStatus) {
      getIO().to(`user:${task.createdBy}`).emit("taskStatusChanged", {
        message: "Task status has been changed",
        taskId: task._id,
        title: task.title,
        oldStatus,
        newStatus: task.status,
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
