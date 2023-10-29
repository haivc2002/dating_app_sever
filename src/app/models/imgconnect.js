const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imageconnect = new Schema(
    {
        connect: {type: Number},
        location: {type: Number},
        listimage: { type: String },
    },
);
module.exports = mongoose.model('connects', imageconnect);