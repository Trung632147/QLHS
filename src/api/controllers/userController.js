//userController.js
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');

// Controller để lấy thông tin của tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller để tạo mới một người dùng
exports.createUser = async (req, res) => {
    const { name, phone, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
        name,
        phone,
        email,
        password: hashedPassword
    });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) =>{
    const {name, phone, email, password} = req.body;
    try{
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            req.body.password = hashedPassword;
        }
       const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if(!updateUser){
            return res.status(404).json({message: 'Không tìm thấy user: ' + req.params.id});
        }
        res.json(updateUser);
    } catch(err){
         res.status(500).json({message: err.message});
    }
}

// Controller để xóa một người dùng
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
