import projectSchema from "../models/projectSchema.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, members, startDate, endDate } = req.body;

    const project = await projectSchema.create({
      name,
      description,
      members: members || [],
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "MEMBER") {
      query.members = req.user._id;
    }

    const projects = await projectSchema
      .find(query)
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await projectSchema
      .findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (req.user.role === "MEMBER") {
      const isMember = project.members.some(
        (member) => member._id.toString() === req.user._id.toString(),
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this project",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatedProject = async (req, res) => {
  try {
    const project = await projectSchema.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updatedProject = await projectSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await projectSchema.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addProjectMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await projectSchema.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const alreadyMember = project.members.some(
      (member) => member.toString() === userId,
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a project member",
      });
    }

    project.members.push(userId);

    await project.save();

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeProjectMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await projectSchema.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId,
    );

    await project.save();

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
