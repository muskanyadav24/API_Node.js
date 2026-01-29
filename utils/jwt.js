const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token generated successfully", token);

    return token;
}

const verifyToken = (token) => {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully", decoded);
    return decoded;
    
}

module.exports = {generateToken, verifyToken};