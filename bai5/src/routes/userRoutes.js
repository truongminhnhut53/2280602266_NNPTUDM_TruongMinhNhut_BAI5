const express = require('express');
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  enableUser,
  disableUser,
} = require('../controllers/userController');

// GET    /api/users             - Lấy tất cả users (query: ?username=...)
// POST   /api/users             - Tạo user mới
// GET    /api/users/:id          - Lấy user theo id
// PUT    /api/users/:id          - Cập nhật user
// DELETE /api/users/:id          - Xoá mềm user
// POST   /api/users/enable       - Enable user (body: email, username)
// POST   /api/users/disable      - Disable user (body: email, username)

// ⚠️  Lưu ý: /enable và /disable phải khai báo TRƯỚC /:id
//    để Express không nhầm "enable"/"disable" là một :id
router.post('/enable', enableUser);
router.post('/disable', disableUser);

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
