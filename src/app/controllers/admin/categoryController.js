const Category = require('../../models/categorys');
const mongoose = require('mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');

const categoryController = {
  getform: (req, res, next) => {
    Category.find({})
      .then(dm => {
        res.render('admin/categorys/index', {
          categories: mutipleMongooseToObject(dm)
        });
      })
      .catch(next);
  },

  add: (req, res, next) => {
    const danhmuc = req.body.danhmuc;
    const newCategory = new Category({ danhmuc: danhmuc });
    newCategory.save()
      .then(() => {
        console.log('Đã lưu dữ liệu vào MongoDB');
        res.send({ message: 'Thành công' });
      })
      .catch(error => {
        console.error(error);
        res.status(500).send({ error: 'Lỗi server.' });
      });
  },

  dele: (req, res, next) => {
    const categoryId = req.params.id;
    Category.deleteOne({ _id: categoryId })
      .then(() => res.send({ message: 'Xóa thành công' }))
      .catch(error => {
        console.error(error);
        res.status(500).send({ error: 'Lỗi server.' });
      });
  },


  update: async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      const updatedData = req.body.danhmuc;

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { danhmuc: updatedData },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
    } catch (error) {
      console.error('Error updating category: ', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  showdatajson: (req, res) => {
    Category.find({}, (err, categories) => {
        if (err) {
            console.error('Lỗi truy vấn danh mục:', err);
            res.status(500).json({ error: 'Lỗi server.' });
        } else {
            res.json(categories);
        }
    });
}
}
module.exports = categoryController;
