const mongoose = require("mongoose");

const ArtWork = new mongoose.Schema(
    {
        title: {type: String, required: true},
        image: {type: String, required: true},
        price: {type: Number, required: true},
        creater: {type: String, required: true},
        owner: {type: String, required: true},
        desc: {type: String}
    },
    { timestamps: true }
);


module.exports = mongoose.model("Art", ArtWork);