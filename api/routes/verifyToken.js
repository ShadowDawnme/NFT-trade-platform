const jwt = require("jsonwebtoken");
const ObjectId = require('mongoose').Types.ObjectId;

// decrypt jwt on header and put decrypted token to req.decrypedToken (temp store)
const verifyToken = (req, res, next) => {
    const headerToken = req.headers.token;
    if (headerToken) {
        const token = headerToken.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, decrypedToken) => {  // actually is decoded token here!
            if (err) res.status(403).json("Token not valid");
            req.decrypedToken = decrypedToken;
            next();  // callback
        })
    } else {
        res.status(401).json("Not authenticated");  // no token in header or tiken expires or token is fake
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.decrypedToken.id === req.body.userId && req.decrypedToken.isAdmin) {
            next();
        } else {
            res.status(403).json("Action not allowed");
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.decrypedToken.isAdmin) {
            next();
        } else {
            res.status(403).json("Action not allowed");
        }
    })
}

function isValidObjectId(id){
    if(ObjectId.isValid(id)){
        if((String) (new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}


module.exports = { 
    verifyToken,
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin,
    isValidObjectId 
    };