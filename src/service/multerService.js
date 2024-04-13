//multerService.js
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Thư mục lưu trữ tệp
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Tên tệp mới
    }
});

module.exports = multer({ storage: storage });
