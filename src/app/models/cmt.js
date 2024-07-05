const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cmt = new Schema(
    {
        idvisitor: { type: String,},
        coment: { type: String },
        idart: {type: String},
        mentioned: {type: String},
    },
);
module.exports = mongoose.model('cmts', Cmt);
