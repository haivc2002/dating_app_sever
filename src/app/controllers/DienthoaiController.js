const Dienthoai = require('../models/Dienthoai');
const { mongooseToObject } = require('../../util/mongoose');





class DienthoaiController {
    // [GET] / chi tiết sp 
    show(req, res, next) {
        Dienthoai.findOne({ slug: req.params.slug })
            .then((dienthoai) =>
                res.render('show', {
                    dienthoai: mongooseToObject(dienthoai),
                }),
            )
            .catch(next);
    }
    create(req, res, next) {
        res.render('dienthoais/create');
    }

    store(req, res, next) {
        const formData = req.body;
        formData.image = req.file.path.substring(19); // Loại bỏ phần "/uploads" từ đầu đường dẫn
        const dienthoai = new Dienthoai(formData);
        dienthoai.save()
            .then(() => res.redirect('/me/stored/dienthoais'))
            .catch(error => {
            });
    }

    // [GET] /courses/edit
    edit(req, res, next) {
        Dienthoai.findById(req.params.id)
            .then((dienthoai) =>
                res.render('dienthoais/edit', {
                    dienthoai: mongooseToObject(dienthoai),
                }),
            )
            .catch(next);
    }
    // [GET] /courses/edit
    update(req, res, next) {
        Dienthoai.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/dienthoais'))
            .catch(next);
    }
    // [DELETE] /courses/:id
    destroy(req, res, next) {
        Dienthoai.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

}

module.exports = new DienthoaiController();