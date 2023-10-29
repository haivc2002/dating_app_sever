// const Dienthoai = require('../models/Dienthoai');
const { mutipleMongooseToObject } = require('../../../util/mongoose');
class homeController {
    start(req, res, next) {
        res.render('visitor/start');
    }
    // searchByName(req, res, next) {
    //     const searchKeyword = req.query.q; // Lấy từ khóa tìm kiếm từ query string
    //     Dienthoai.find({ name: { $regex: new RegExp(searchKeyword, 'i') } })
    //         .then((dienthoais) => {
    //             res.render('search', {
    //                 dienthoais: mutipleMongooseToObject(dienthoais),
    //             });
    //         })
    //         .catch(next);
    // }


}
module.exports = new homeController;
