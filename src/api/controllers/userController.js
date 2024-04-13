//userController.js
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../../middleware/generateToken').generateToken;
require('dotenv').config();

// Lấy thông tin của tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Đăng ký
exports.register = async (req, res) => {
    console.log(req.body);
    const { name, phone, email, password, role } = req.body;
    
    
    let avatar = null;
        if (req.file) {
            avatar = req.file.path;
        }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            phone,
            email,
            password: hashedPassword,
            avatar,
            role
        });
        const newUser = await user.save();

        // Tạo AccessToken
        const newAccessToken = generateToken(newUser._id, 'access', { email: newUser.email, role: newUser.role });

        res.status(201).json({ message: "Đăng ký thành công", user: newUser, accessToken: newAccessToken });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    try {
        // Kiểm tra xem có email và password được cung cấp hay không
        if (email && password) {
            // Đăng nhập bằng email và password
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác." });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác." });
            }

    
            req.session.user = {
                userId: user._id,
                email: user.email,
                role: user.role,
                
            };
            console.log("Session:", req.session);
            return res.json({ message: "Đăng nhập thành công!"});
        } else if (accessToken) {
            // Xác thực AccessToken nếu có
            jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    return res.status(403).json({ message: "AccessToken không hợp lệ hoặc đã hết hiệu lực." });
                }

                // Lấy thông tin từ payload
                const { email, role } = decodedToken;

                // Lưu thông tin người dùng vào session
                req.session.user = {
                    userId: decodedToken.id,
                    email: email,
                    role: role,
                    accessToken: accessToken
                };
                console.log("Session:", req.session);
                return res.json({ message: "Đăng nhập thành công!", accessToken });
            });
        } else {
            return res.status(400).json({ message: "Vui lòng cung cấp email và password hoặc AccessToken." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        // Xóa thông tin người dùng khỏi session
        delete req.session.user;

        res.status(200).json({ message: "Đăng xuất thành công!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) =>{
    const { name, phone, email, password } = req.body;
    const userId = req.user.id; // Lấy ID của người dùng từ req.user

    try {
        // Kiểm tra nếu người dùng là admin hoặc là người dùng đang cố gắng cập nhật thông tin của họ
        if (req.user.role === 'admin' || req.params.id === userId) {
            // Nếu có yêu cầu cập nhật mật khẩu, thì tiến hành hash mật khẩu mới
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                req.body.password = hashedPassword;
            }

            const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (!updateUser) {
                return res.status(404).json({ message: 'Không tìm thấy user: ' + req.params.id });
            }
            res.json(updateUser);
        } else {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện chức năng này' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Xóa một người dùng
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).json({message: 'Không tìm thấy user:' + req.params.id});
        }
        res.status(200).json({message: 'Xoá thành công user: '+ req.params.id});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};