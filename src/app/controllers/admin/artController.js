const Category = require('../../models/categorys');
const Art = require('../../models/art');
const ImageConnect = require('../../models/imgconnect');
const mongoose = require('mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

const artController = {
  getForm: async (req, res, next) => {
    try {
      const arts = await Art.find({});
      const artsWithImages = await Promise.all(arts.map(async (art) => {
        const connect = art.connect;
        const image = await ImageConnect.findOne({ connect: connect, location: 1 });
        return { ...art.toObject(), image: image };
      }));
      res.render('admin/art/viewart', { arts: artsWithImages });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
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

  add: (req, res, next) => {
    const title = req.body.title;
    const source = req.body.source;
    const info = req.body.info;
    const connect = req.body.connect;
    const newArt = new Art({
      title: title,
      source: source,
      info: info,
      connect: connect,
    });
    newArt.save()
      .then(() => {
        console.log('Đã lưu dữ liệu vào MongoDB');
        res.redirect('/art/viewart')
      })
      .catch(error => {
      });
  },

  dele: async (req, res, next) => {
    try {
      const artId = req.params.id;
      const deletedArt = await Art.findByIdAndDelete(artId);
      if (!deletedArt) {
        return res.status(404).json({ message: 'Không tìm thấy dữ liệu art để xóa' });
      }
      const deletedImageConnects = await ImageConnect.deleteMany({ connect: deletedArt.connect });
      return res.status(200).json({ message: 'Xóa thành công art và các imageconnect liên quan' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Lỗi server.' });
    }
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
  },

  formedit: async (req, res, next) => {
    try {
      const dm = await Category.find({});
      const art = await Art.findById(req.params.id);
      const images = await ImageConnect.find({ connect: art.connect });
      res.render('admin/art/edit', {
        title: art.title,
        source: art.source,
        info: art.info,
        connect: art.connect,
        categories: mutipleMongooseToObject(dm),
        art: art,
        images: images
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  edit: async (req, res, next) => {
    try {
      const artID = req.params.id;
      const { title, source, info } = req.body;

      const updatedArt = await Art.findByIdAndUpdate(
        artID,
        { title: title, source: source, info: info },
        { new: true }
      );

      if (!updatedArt) {
        return res.status(404).json({ message: 'Art not found' });
      }

      res.status(200).json({ message: 'Art updated successfully', data: updatedArt });
    } catch (error) {
      console.error('Error updating art: ', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
}
module.exports = artController;
