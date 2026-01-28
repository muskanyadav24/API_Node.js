const {verifyToken} = require("../../utils/jwt");

const authMiddle = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log("Token", token);        
        if(!token){
            console.log("Token not found")
            res.status(401);
            return res.json({ message: "Token not found" })
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        console.log("User authenticated successfully", decoded);
        next();
    }catch(err){
        console.log("Error in auth middle", err)
        res.status(500);
        return res.json({ message: err.message })
    }
}

module.exports = {authMiddle}