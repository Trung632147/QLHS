//userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multerService = require('../../service/multerService');
const { validateRegister, validateRegisterMiddleware } = require('../../service/userValidator');
const { authenticateToken, authorizeMiddleware } = require('../../middleware/authMiddleware');

// Lấy thông tin của tất cả người dùng
router.get('/', userController.getAllUsers);

// Đăng ký
router.post('/register', multerService.single('avatar'), validateRegister, validateRegisterMiddleware, userController.register);

// Đăng nhập
router.post('/login', userController.loginUser);

// Đăng xuất
router.post('/logout', userController.logoutUser);

// Xác thực và phân quyền
router.put('/updateuser/:id', authenticateToken, userController.updateUser);
router.delete('/deleteuser/:id', authenticateToken, authorizeMiddleware(['admin']), userController.deleteUser);

module.exports = router;
