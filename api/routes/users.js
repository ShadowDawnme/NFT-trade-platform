const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");
const User = require("../models/User");

const router = require("express").Router();

router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, salt, property, uploads, ...others} = user._doc;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.get("/name/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.setHeader("Access-Control-Allow-Origin", "*");
        const {password, salt, property, uploads, ...others} = user._doc;
        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;