const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");
const ArtWork = require("../models/ArtWork");
const User = require("../models/User");
const Deal = require("../models/Deal");
const router = require("express").Router();
const CryptoJS = require("crypto-js");

/* buy product - request example
hearder should contain web access token!!!
{
    "userId": "6254fa07439e983712c7f31a",
}
*/
router.post("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const artWork = await ArtWork.findOne({ _id: req.params.id });
        
        if (!artWork) { res.status(200).json("Error: No such art work"); return; }
        if (artWork.creater === req.body.userId) { res.status(200).json("Error: Cannot buy your own work"); return; }
        if (artWork.owner === req.body.userId) { res.status(200).json("Error: You already owns the work"); return; }

        const dealInfo = { buyer: req.body.userId, seller: artWork.owner, artId: artWork.id, price: artWork.price, tx_hash: "" };
        const deal = new Deal(dealInfo);

        // add to deal table
        await deal.save();

        // generate hash for transactions
        const tx_hash = CryptoJS.SHA256({ id: deal._id, buyer: req.body.userId, seller: artWork.owner, 
            artId: artWork.id, price: artWork.price, dealTime: deal.createdAt}).toString()

        // generate tx_hash for the transaction
        await Deal.updateOne(
            { _id: deal._id }, 
            { $set: { tx_hash: tx_hash } }
            );

        // update buyer property
        await User.updateOne(
            { _id: req.body.userId }, 
            { $addToSet: { property: artWork._id } }
            );

        // update owner property
        await User.updateOne(
            { _id: artWork.owner }, 
            { $pull: { property: artWork._id } }
            );

        // update art work owner
        await ArtWork.updateOne(
            { _id: artWork._id },
            { $set: { owner: req.body.userId} }
        );
        res.status(200).json(artWork);
    } catch(err) {
        res.status(200).json("Error");
    }

})


module.exports = router;