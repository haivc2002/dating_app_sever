const Category = require('../../models/categorys');
const Art = require('../../models/art');
const ImageConnect = require('../../models/imgconnect');
const mongoose = require('mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

const artController = {
  getform: (req, res, next) => {
    Art.find({})
      .then(art => {
        res.render('admin/art/viewart', {
          arts: mutipleMongooseToObject(art)
        });
      })
      .catch(next);
  },

  formadd: async (req, res, next) => {
    try {
      const dm = await Category.find({});
      const maxConnectArt = await Art.find({ connect: { $gt: 0 } })
        .sort({ connect: -1 })
        .limit(1);

      let maxConnect = 0;
      if (maxConnectArt.length > 0) {
        maxConnect = maxConnectArt[0].connect;
      }

      res.render('admin/art/add', {
        categories: mutipleMongooseToObject(dm),
        maxConnect: maxConnect + 1
      });
    } catch (error) {
      next(error);
    }
  },

  add(req, res, next) {
    const formData = req.body;
    formData.image = req.file.path.substring(19);
    const artifacts = new Art(formData);
    artifacts.save()
      .then(() => res.redirect('/art/viewart'))
      .catch(error => {
      });
  },

  // formedit: async(req, res, next) => {
  //   try {
  //     const dm = await Category.find({});
  //     const art = await Art.findById(req.params.id);
  //     const maxConnectArt = await Art.find({ connect: { $gt: 0 } })
  //       .sort({ connect: -1 })
  //       .limit(1);

  //     let maxConnect = 0;
  //     if (maxConnectArt.length > 0) {
  //       maxConnect = maxConnectArt[0].connect;
  //     }

  //     res.render('admin/art/edit', {
  //       categories: mutipleMongooseToObject(dm),
  //       maxConnect: maxConnect,
  //       Art: mongooseToObject(art),
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  // edit(req, res, next) {
  //   Art.updateOne({ _id: req.params.id }, req.body)
  //       .then(() => res.redirect('/art/viewart'))
  //       .catch(next);
  // }

  dele(req, res, next) {
    const artId = req.params.id;
    Art.deleteOne({ _id: artId })
      .then(() => res.send({ message: 'Xóa thành công' }))
      .catch(error => {
        console.error(error);
        res.status(500).send({ error: 'Lỗi server.' });
      });
  },

  saveImage: (req, res, next) => {
    const formData = req.body;
    const listimg = new ImageConnect({
      connect: formData.connect,
      location: formData.location,
      listimage: req.file.path.substring(19)
    });

    listimg.save()
      .then(() => {
        res.status(200).send('Image saved successfully');
      })
      .catch(error => {
        res.status(500).send('Error while saving image');
      });
  },

  deleteImage: async (req, res, next) => {
    try {
      const formData = req.body;
      const { connect, location } = formData;

      const deletedDoc = await ImageConnect.deleteOne({ connect: connect, location: location });

      if (deletedDoc.deletedCount === 0) {
        return res.status(404).send('Image not found');
      }

      return res.status(200).send('Image deleted successfully');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error while deleting image');
    }
  }
}
module.exports = artController;
