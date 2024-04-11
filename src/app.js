//app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./api/routes/userRoutes')

// Khởi tạo ứng dụng Express
const app = express();

// Thiết lập biến môi trường
dotenv.config();

// Kết nối database
connectDB();

app.use(express.json());
app.use('/api', userRoutes)

/*const createUser = async () => {
    const newUser = new User({
        name: 'John Doe2',
        phone: '12345678902',
        email: 'john@example90.com',
        password: 'password1234'
    });

    try {
        const savedUser = await newUser.save();
        console.log('New user created:', savedUser);
    } catch (err) {
        console.error('Error creating user:', err);
    }
};
createUser();*/

// Khởi động server và lắng nghe cổng
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
