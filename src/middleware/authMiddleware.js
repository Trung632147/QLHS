//authMiddleware
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: "Bạn cần đăng nhập để thực hiện hành động này." });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Bạn cần đăng nhập để thực hiện hành động này." }); 

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra người dùng có tồn tại trong hệ thống không
        const user = await User.findById(decodedToken.id);
        if (!user) {
            console.log("Người dùng không tồn tại trong hệ thống.");
            return res.status(401).json({ message: "Người dùng không tồn tại trong hệ thống." });
        }

        req.user = decodedToken;
        next();
    } catch (err) {
        console.error("Lỗi xác thực token:", err);
        return res.sendStatus(403); // Token không hợp lệ
    }
};

const authorizeMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user) return res.sendStatus(401);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện chức năng này' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeMiddleware };
