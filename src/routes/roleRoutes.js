const express = require('express');
const router = express.Router();

const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');

const { getUsersByRoleId } = require('../controllers/userController');

// GET    /api/roles             - Lấy tất cả roles
// POST   /api/roles             - Tạo role mới
// GET    /api/roles/:id          - Lấy role theo id
// PUT    /api/roles/:id          - Cập nhật role
// DELETE /api/roles/:id          - Xoá mềm role
// GET    /api/roles/:id/users    - Lấy tất cả users thuộc role đó

router.get('/', getAllRoles);
router.post('/', createRole);
router.get('/:id', getRoleById);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

// Yêu cầu 4: GET /roles/:id/users
router.get('/:id/users', getUsersByRoleId);

module.exports = router;
