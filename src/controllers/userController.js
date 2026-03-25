const User = require('../models/User');

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, status, role, loginCount } = req.body;

    const user = await User.create({
      username,
      password,
      email,
      fullName,
      avatarUrl,
      status,
      role,
      loginCount,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL (có query theo username) ────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { username } = req.query;

    // Build filter: chỉ lấy user chưa bị xoá mềm
    const filter = { isDeleted: false };

    // Nếu có query username => tìm kiếm contains (case-insensitive)
    if (username) {
      filter.username = { $regex: username, $options: 'i' };
    }

    const users = await User.find(filter).populate('role', 'name description');

    return res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, isDeleted: false }).populate('role', 'name description');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    ).populate('role', 'name description');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── SOFT DELETE ──────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully (soft delete)',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ENABLE (POST /users/enable) ─────────────────────────────────────────────
// Body: { email, username }  => nếu khớp => set status = true
const enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ success: false, message: 'email and username are required' });
    }

    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: true },
      { new: true }
    ).populate('role', 'name description');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or email/username mismatch',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User enabled successfully',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DISABLE (POST /users/disable) ───────────────────────────────────────────
// Body: { email, username }  => nếu khớp => set status = false
const disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ success: false, message: 'email and username are required' });
    }

    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: false },
      { new: true }
    ).populate('role', 'name description');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or email/username mismatch',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User disabled successfully',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET USERS BY ROLE ID (GET /roles/:id/users) ─────────────────────────────
const getUsersByRoleId = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.find({ role: id, isDeleted: false }).populate('role', 'name description');

    return res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  enableUser,
  disableUser,
  getUsersByRoleId,
};
