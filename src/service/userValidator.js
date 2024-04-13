//userValidator.js
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');

// Khai báo middleware kiểm tra email đã tồn tại hay chưa
const checkExistingEmail = async (email) => {
    try {
        // Kiểm tra xem email đã tồn tại trong hệ thống hay không
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.");
        }
    } catch (error) {
        throw error;
    }
};

exports.validateRegister = [
    body('name').notEmpty().withMessage('Vui lòng nhập tên.'),
    body('email')
        .isEmail().withMessage('Email không hợp lệ.')
        .normalizeEmail()
        .custom(async (value) => {
            await checkExistingEmail(value);
        }),
    body('password')
        .notEmpty().withMessage('Vui lòng nhập mật khẩu.')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải chứa ít nhất 6 ký tự.') // Đảm bảo mật khẩu có ít nhất 6 ký tự
];

exports.validateRegisterMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
