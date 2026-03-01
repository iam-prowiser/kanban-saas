const jwt = require("jsonwebtoken")

const authMiddleware = function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const trimmedToken = authHeader.split(" ");
    if(trimmedToken.length!==2){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const decodedToken  = trimmedToken[1];
    jwt.verify(decodedToken, process.env.JWT_SECRET, (err, data) => {
        if(err){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        req.user = data;
        next();
    })
}
module.exports = authMiddleware