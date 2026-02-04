// const {verifyToken} = require("../../utils/jwt");

// const authMiddle = (req, res, next) => {
//     let token = req.headers.authorization?.split(" ")[1];
//     if(!token){
//         console.log("Token not found")
//         res.status(401);
//         return res.json({ message: "Token not found..." , status: 401, data:[]});
//     }
    
//     let isVerified = verifyToken(token);
//     if(!isVerified){
//         console.log("Token is not verified")
//         res.status(401);
//         return res.json({ message: "Token is not verified..." , status: 401, data:[]});
//     }

//     req.user = isVerified;
//     next();
// }

const User = require("../../models/userModel");
const { verifyToken } = require("../../utils/jwt");

const authMiddle = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Token not found...",
                status: 401,
                data: []
            });
        }

        const isVerified = verifyToken(token);
        if (!isVerified) {
            return res.status(401).json({
                message: "Token is not verified...",
                status: 401,
                data: []
            });
        }

        // CHECK USER IN DB (soft delete check)
        const user = await User.findOne({
            _id: isVerified.id,
            isDeleted: false
        }).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found or deleted",
                status: 401,
                data: []
            });
        }

        req.user = user; // fresh DB user
        next();

    } catch (err) {
        console.log("Error in auth middleware", err);
        return res.status(500).json({
            message: err.message,
            status: 500,
            data: []
        });
    }
};


// const authorized = (roles) => {
//     // console.log("Roles", roles);
//     return (req, res, next) => {
//         if(!roles.includes(req.user.role)){
//             res.status(403);
//             return res.json({ message: "Not authorized..." , status: 403, data:[]});
//         }
//         next();
//     }
// }

const authorized = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Not authorized...",
                status: 403,
                data: []
            });
        }
        next();
    };
};


module.exports = {authMiddle, authorized }