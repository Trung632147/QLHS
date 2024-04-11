//userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route để lấy thông tin của tất cả người dùng
router.get('/', userController.getAllUsers);

// Route để tạo mới một người dùng
router.post('/createuser', userController.createUser);

// Route để cập nhật một người dùng
router.put('/updateuser/:id', userController.updateUser);

// Route để xóa một người dùng
router.delete('/deleteuser/:id', userController.deleteUser);

module.exports = router;
