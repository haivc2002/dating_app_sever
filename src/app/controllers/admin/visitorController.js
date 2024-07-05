const ImageConnect = require('../../models/imgconnect');
const Visitor = require('../../models/visitor');
const Cmt = require('../../models/cmt')
const Art = require('../../models/art')
const mongoose = require('mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');
const visitorController = {
  getForm: async (req, res, next) => {
    try {
      const cmts = await Cmt.find().populate([
        { path: 'idvisitor', model: 'visitors', select: 'tendangnhap avt' },
        { path: 'idart', model: 'arts', select: 'title' },
      ]);
      
      const visitors = await Visitor.find().select('tendangnhap avt');

      res.render('admin/visitor/visitor.ejs', { cmts, visitors });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
}
module.exports = visitorController;