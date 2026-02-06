const jwt = require("jsonwebtoken");

// Generate Token 
const generateToken = (payload) => {
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token generated successfully", token);

    return token;
}

// Token verify 
const verifyToken = (token) => {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully", decoded);
    return decoded;
    
}

module.exports = {generateToken, verifyToken};
