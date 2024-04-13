//app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const session = require('express-session');
const userRoutes = require('./api/routes/userRoutes')

// Khởi tạo ứng dụng Express
const app = express();

// Thiết lập biến môi trường
dotenv.config();

// Kết nối database
connectDB();

app.use(session({
    secret: 'secret_key', 
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', userRoutes)

// Khởi động server và lắng nghe cổng
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
