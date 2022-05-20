const User = require("../models/User");
const router = require("express").Router();
const crypto = require("crypto");
const rs = require('jsrsasign');
const jwt = require("jsonwebtoken");


const randomSalt = () => {
    str = "";
    for (let i = 0; i < 20; i++) {
        const base = Math.random() < 0.5 ? 65 : 97;
        str += String.fromCharCode(
            base + 
            Math.floor(
                Math.random() * 26 
            )
        );
    }
    return str;
};

const saltPassword = (salt, pwd) => {
    const hash = crypto.createHash('sha512', salt);
    return hash.update(pwd).digest('hex');
}

// sign up - request example
router.get("/register", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    // get username and pasword from query and decrypt them
    const username = prkDecrypt(req.query.acct);
    const pwd = prkDecrypt(req.query.pwd);

    const salt = randomSalt();  // get random salt with 20 chars
    const saltedPassword = saltPassword(salt, pwd);  // salt the password
    const newUser = new User (
        {
            username: username,
            password: saltedPassword,
            salt: salt
        }
    );

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch(err) {
        res.status(200).json("Error: Account already exist");
    }
})

const prkDecrypt = (text) => {
    var prv = rs.KEYUTIL.getKey(prvKey);
    return rs.KJUR.crypto.Cipher.decrypt(text, prv);
}

// login
router.get("/login", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
        const username = prkDecrypt(req.query.acct);
        const pwd = prkDecrypt(req.query.pwd);
        // console.log(username, pwd);

        const user = await User.findOne({username: username});  // user record from db
        
        // check if there is such user
        !user && res.status(200).json("Acoount or password is wrong");

        // check the passeord
        const saltedPassword = saltPassword(user.salt, pwd);
        user.password !== saltedPassword && res.status(200).json("Acoount or password is wrong");

        // password correct
        // generate web access token when login and send back to user, using SHA-256 algorithm to signature (default)
        const accessToken = jwt.sign(
            {
                id: user._id, 
                isAdmin: user.isAdmin,
            },     
            process.env.JWT_SEC,  // secret key
            { expiresIn: "3d" }  // token will expire after 3 days
        );
        // const cipher = crypto.
        const {password, salt, property, uploads, ...others} = user._doc;  // send back user except password
        res.status(200).json({...others, accessToken});

    } catch(err) {
        res.status(500).json(err);
    }
})

var prvKey;
router.get("/pk", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 512,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            // cipher: 'aes-256-cbc',
            // passphrase: 'top secret'
        }
    });

    prvKey = privateKey;

    try {
        res.status(200).json(publicKey);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;