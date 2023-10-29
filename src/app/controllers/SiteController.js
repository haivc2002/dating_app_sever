const Dienthoai = require('../models/Dienthoai');
const { mutipleMongooseToObject } = require('../../util/mongoose');
class SiteController {
    // [GET] /
    index(req, res, next) {
        Dienthoai.find({})
            .then((dienthoais) => {
                res.render('home', {
                    dienthoais: mutipleMongooseToObject(dienthoais),
                });
            })
            .catch(next);
    }
    // [GET] /news/:slug
    // search(req, res) {
    //     res.send('search')
    // }
    
   // Trong SiteController.js
searchByName(req, res, next) {
    const searchKeyword = req.query.q; // Lấy từ khóa tìm kiếm từ query string
    Dienthoai.find({ name: { $regex: new RegExp(searchKeyword, 'i') } })
        .then((dienthoais) => {
            res.render('search', {
                dienthoais: mutipleMongooseToObject(dienthoais),
            });
        })
        .catch(next);
}

    
}
module.exports = new SiteController;
