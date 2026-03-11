const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    },
    likecount: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    })
const likeModel = mongoose.model('Like', likeSchema);
module.exports = likeModel;