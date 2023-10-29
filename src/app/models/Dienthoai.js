const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Dienthoai = new Schema(
    {
        name: { type: String, required: true },
        ThongTin: { type: String },
        image: { type: String },
        GiaCu: {type: String },
        GiaMoi: {type: String },
        HangSX: { type: String },
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('dienthoais', Dienthoai);

