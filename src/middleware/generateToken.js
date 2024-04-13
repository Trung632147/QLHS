//generateToken
const jwt = require('jsonwebtoken');

const generateToken = (userId, tokenType, additionalData) => {
    let expiresIn;
    let secret;

    if (tokenType === 'access') {
        expiresIn = '1h'; 
        secret = process.env.JWT_SECRET;
    } else if (tokenType === 'refresh') {
        expiresIn = '1d'; // RefreshToken hết hạn sau 1 ngày
        secret = process.env.JWT_REFRESH_SECRET;
    }

    // Tạo payload của token với thông tin userId và các thông tin bổ sung (email, role)
    const payload = { id: userId, ...additionalData };

    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
};

module.exports.generateToken = generateToken;


