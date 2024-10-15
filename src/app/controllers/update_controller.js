const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');
const RegisterFunction = require('../functions/register_function');
const query = require('../init/query');
const path = require('path');
const Common = require('../common');
const fs = require('fs');

const functions = new RegisterFunction();

const UpdateController = {
    updateUser: async (req, res) => {
      const { idUser, info, infoMore } = req.body;

      if (!idUser) {
        return res.status(200).json({
          result: 'Error',
          message: 'idUser is required',
        });
      }
      await query.updateInfo(info, idUser);
      const [day, month, year] = info.birthday.split('/').map(Number);
      const zodiac = functions.getZodiacSign(day, month);
      await query.updateInfoMore(infoMore, idUser, zodiac);
      const response = {
        result: 'Success',
        idUser: idUser,
        message: 'Update info success',
      };

      return res.json(response);
    },
    
    updateImage: async (req, res) => {
      const id = req.body.id;
      const newImageFile = req.file;
      const newImagePath = newImageFile ? path.basename(newImageFile.path) : req.body.image;

      if (!id || !newImagePath) {
        return res.status(400).json({
          result: 'Error',
          message: 'Both id and image URL are required',
        });
      }

      try {
        const oldImage = await query.getImageById(id);

        if (!oldImage) {
          return res.status(404).json({
            result: 'Error',
            message: 'Image not found',
          });
        }

        // Cập nhật ảnh mới vào cơ sở dữ liệu
        await query.updateImage(id, Common.urlDefault + newImagePath);

        // Xóa ảnh cũ khỏi hệ thống file
        const uploadsDir = path.join(__dirname, '../../public/uploads');
        const oldImagePath = path.join(uploadsDir, path.basename(oldImage.image.replace(Common.urlDefault, '')));

        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error('Error deleting old image file:', err);
              return res.status(500).json({
                result: 'Error',
                message: 'Failed to delete old image file',
              });
            }

            return res.json({
              result: 'Success',
              message: 'Image updated successfully',
            });
          });
        } else {
          return res.json({
            result: 'Success',
            message: 'Image updated successfully, but old image file not found',
          });
        }
      } catch (error) {
        console.error("Error in updateImage controller:", error);
        return res.status(500).json({
          result: 'Error',
          message: 'Failed to update image',
        });
      }
    },

    updateLocation: async (req, res) => {
      const { lat, lon, idUser, token } = req.body;
      if (!lat || !lon || !idUser) {
        return res.status(400).json({
          result: 'Error',
          message: 'Obligatory lat, lon, idUser'
        });
      }
    
      try {
        await query.updateLocation(lat, lon, idUser);
        if (token) await query.updateToken(token, idUser);
        return res.json({
          result: 'Success',
          message: 'Change location and update token success'
        });
      } catch (err) {
        return res.status(500).json({ error: 'Error database', details: err.message });
      }
    },

    deleteImage: async (req, res) => {
      const { id } = req.params;
    
      if (!id) {
        return res.status(400).json({
          result: 'Error',
          message: 'Image ID is required',
        });
      }
    
      try {
        const image = await query.getImageById(id);
    
        if (!image) {
          return res.status(404).json({
            result: 'Error',
            message: 'Image not found',
          });
        }
    
        await query.deleteImageById(id);
    
        const imagePath = path.join(__dirname, '../../public/uploads', path.basename(image.image.replace(Common.urlDefault, '')));
        console.log(imagePath);
        
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error('Error deleting image file:', err);
              return res.status(500).json({
                result: 'Error',
                message: 'Failed to delete image file',
              });
            }
    
            return res.status(200).json({
              result: 'Success',
              message: 'Image deleted successfully',
            });
          });
        } else {
          return res.status(404).json({
            result: 'Error',
            message: 'Image file not found',
          });
        }
      } catch (error) {
        console.error('Error in deleteImage controller:', error);
        return res.status(500).json({
          result: 'Error',
          message: 'Failed to delete image',
        });
      }
    }
}

module.exports = UpdateController;