const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');
const RegisterFunction = require('../functions/register_function');
const query = require('../init/query')

const functions = new RegisterFunction()

const UpdateController = {
    updateUser: async (req, res) => {
      const { idUser, listImage, info, infoMore } = req.body;
    
      if (!idUser) {
        return res.status(200).json({
          result: 'Error', 
          message: 'idUser is required'
        });
      }

      try {
        await query.updateInfo(info, idUser);
        const [day, month, year] = info.birthday.split('/').map(Number);
        const zodiac = functions.getZodiacSign(day, month);
        await query.updateInfoMore(infoMore, idUser, zodiac);
        await Promise.all(listImage.map(image => query.updateImage(image, idUser)));
        const response = {
          result: 'Success',
          idUser: idUser,
          message: 'Update info success'
        };
        return res.json(response);
      } catch(err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
    },

    updateLocation: async (req, res) => {
      const { lat, lon, idUser } = req.body;
      if (!lat || !lon || !idUser) {
        return res.status(200).json({
          result: 'Error',
          message: 'Obligatory lat, lon, idUser'
        });
      }
  
      try {
        await query.updateLocation(lat, lon, idUser);
        return res.json({
          result: 'Success',
          message: 'Change location success'
        });
      } catch (err) {
        return res.status(500).json({ error: 'Error database', details: err.message });
      }
    }
}

module.exports = UpdateController;