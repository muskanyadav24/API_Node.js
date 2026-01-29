const {verifyToken} = require("../../utils/jwt");

const authMiddle = (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if(!token){
        console.log("Token not found")
        res.status(401);
        return res.json({ message: "Token not found..." , status: 401, data:[]});
    }
    
    let isVerified = verifyToken(token);
    if(!isVerified){
        console.log("Token is not verified")
        res.status(401);
        return res.json({ message: "Token is not verified..." , status: 401, data:[]});
    }

    req.user = isVerified;
    next();
}

const authorized = (roles) => {
    console.log("Roles", roles);
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            res.status(403);
            return res.json({ message: "Not authorized..." , status: 403, data:[]});
        }
        next();
    }
}

module.exports = {authMiddle, authorized }