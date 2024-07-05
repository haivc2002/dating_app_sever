const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitorSchema = new Schema({
    tendangnhap: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avt: { type: String },
});

module.exports = mongoose.model('visitors', visitorSchema);
