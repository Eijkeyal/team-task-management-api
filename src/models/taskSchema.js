import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Provide a task title"],
      trim: true,
      minlength: [3, "Title must not be less than 3 characters"],
      maxlength: [50, "Title cannot exceed 50 characters"],
    },

    description: {
      type: String,
      trim: true,
      minlength: [2, "Description must not be less than 2 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"],
      default: "TODO",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    dueDate: {
      type: Date,
      required: [true, "Provide a due date"],
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assign a task to a user"],
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Assign a project"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
