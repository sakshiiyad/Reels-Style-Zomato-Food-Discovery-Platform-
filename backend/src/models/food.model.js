const mongoose = require("mongoose");

const schema = mongoose.Schema;

const foodSchema = new schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String, //stores the url of the video
        required: true
    },
    description: {
        type: String,

    },
    price: {
        type: Number,
        required: true
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodPartner"


    },
    likecount: {
        type: Number,
        default: 0
    },
    savecount: {
        type: Number,
        default: 0
    }

})
const foodModel = mongoose.model("food", foodSchema);
module.exports = foodModel;