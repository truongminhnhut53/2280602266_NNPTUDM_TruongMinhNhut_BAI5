const Role = require('../models/Role');

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    const role = await Role.create({ name, description });

    return res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Role name already exists' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL ──────────────────────────────────────────────────────────────────
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findOne({ _id: id, isDeleted: false });

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    return res.status(200).json({ success: true, data: role });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { name, description },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Role name already exists' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── SOFT DELETE ──────────────────────────────────────────────────────────────
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully (soft delete)',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createRole, getAllRoles, getRoleById, updateRole, deleteRole };
