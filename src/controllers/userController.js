import userSchema from "../models/userSchema.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userSchema.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await userSchema
      .findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true },
      )
      .select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Role updated Successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await userSchema
      .findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true, runValidators: true },
      )
      .select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Status updated Successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
