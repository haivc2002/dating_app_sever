const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Art = new Schema(
    {
        title: { type: String,},
        source: { type: String },
        info: {type: String},
        connect: {type: Number},
    },
);
module.exports = mongoose.model('arts', Art);

