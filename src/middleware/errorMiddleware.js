// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
    // Kiểm tra nếu status code không được gán, gán mặc định là 500 (Internal Server Error)
    if (!err.status) {
        err.status = 500;
    }

    // Gửi thông báo lỗi về client
    res.status(err.status).json({
        error: {
            message: err.message
        }
    });
};

module.exports = errorHandler;
