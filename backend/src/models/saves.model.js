const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saveSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    }
}, {
    timestamps: true
});

const saveModel = mongoose.model('Save', saveSchema);
module.exports = saveModel;
