const ArtWork = require("../models/ArtWork");
const User = require("../models/User");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");
const mongoose = require("mongoose");

const router = require("express").Router();

/*
creat product - request example
hearder should contain web access token!!!
{
    "userId": "6254fa07439e983712c7f31a",
    "title": "digital art work title",
    "image": "asdasdssadsadawdasad",
    "price": 23.3,
    "des": "Here is description"
}
*/
router.post("/creat", verifyTokenAndAuthorization, async (req, res) => {
    const uid = req.body.userId;
    const artReq = {...req.body, creater: uid, owner: uid}
    const newProduct = new ArtWork(artReq);
    try {
        const savedProduct = await newProduct.save();
        await User.updateOne(
            { _id: uid }, 
            { $addToSet: { property: newProduct._id, uploads: newProduct._id } }
            );
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
        res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
        res.status(200).json(savedProduct);
    } catch(err) {
        res.status(500).json(err);
    }
})

/* get all products - request example
{} can be empty
*/
router.get("/", async (req, res) => {
    try {
        const product = await ArtWork.find();
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json(product);
    } catch(err) {
        res.status(500).json(err);
    }
})

/* get product by art id - request example
{} can be empty
*/
router.get("/:id", async (req, res) => {
    const aid = req.params.id;
    try {
        const product = await ArtWork.findOne({ _id: aid });
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json(product);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;