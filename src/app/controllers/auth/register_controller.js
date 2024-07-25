const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');
const ResponseRegister = require('../../models/auth/response_register');
const ResponseInfo = require('../../models/auth/response_infor');
const Query = require('../../query/query');

Query.tableUser();
Query.tableInfo();


const containsVietnameseCharacters = (str) => {
  const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]/;
  return vietnameseRegex.test(str);
};


const RegisterController = {
  registerApi: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const handleError = ({ err, result, message, status, idUser }) => {
      console.error(`Error: ${message}`, err);
      const response = new ResponseRegister({
        result: result,
        message: message,
        idUser: idUser
      });
      return res.status(status).json(response);
    };

    if (!email || !password) {
      return handleError({
        result: 'Register Error',
        message: 'Email or password cannot be null or empty',
        status: 200
      });
    } else if (containsVietnameseCharacters(email) || containsVietnameseCharacters(password)) {
      return handleError({
        result: 'Error',
        message: 'Cannot format',
        status: 200
      });
    }

    db.serialize(() => {
      db.get('SELECT idUser FROM user WHERE email = ?', [email], (err, row) => {
        if (err) {
          return handleError({
            err: err,
            result: 'Error',
            message: 'Error querying the database',
            status: 500
          });
        } else if (row) {
          return handleError({
            result: 'Register Error',
            message: 'Account already exists',
            status: 200
          });
        }

        db.get('SELECT MAX(idUser) as maxIdUser FROM user', (err, row) => {
          if (err) {
            return handleError({
              err: err,
              result: 'Error',
              message: 'Error querying the database',
              status: 500
            });
          }

          const idUser = row.maxIdUser !== null ? row.maxIdUser + 1 : 0;

          const stmt = db.prepare('INSERT INTO user (email, password, idUser) VALUES (?, ?, ?)');
          stmt.run(email, password, idUser, (err) => {
            if (err) {
              return handleError({
                err: err,
                result: 'Error',
                message: 'Cannot insert data',
                status: 500
              });
            }

            stmt.finalize();
            const response = new ResponseRegister({
              result: 'Register Success',
              idUser: idUser
            });
            res.json(response);
          });
        });
      });
    });
  },

  registerInfo: (req, res) => {
    const {
      idUser,
      name,
      birthday,
      desiredState,
      gender,
      word,
      academicLevel,
      lat,
      lon,
      describeYourself,
    } = req.body;

    const idCompatible = idUser;
    const idImage = idUser;
    const idInfoMore = idUser;
    const premiumState = false;

    if (!idUser || idUser.trim() === '') {
      const response = new ResponseInfo({
        result: 'Error',
        message: 'User ID cannot be null or empty'
      });
      return res.status(200).json(response);
    }
  
    db.serialize(() => {
      db.get('SELECT idUser FROM info WHERE idUser = ?', [idUser], (err, row) => {
        if (err) {
          res.status(500).json({ error: 'Database error', details: err.message });
        } else if (row) {
          const response = new ResponseInfo({
            result: 'Error',
            message: 'User ID already exists'
          });
          res.status(200).json(response);
        } else {
          const stmt = db.prepare(`INSERT INTO info (
            idUser, name, birthday, desiredState, gender, word, academicLevel, lat, lon, describeYourself, 
            premiumState, idCompatible, idImage, idInfoMore
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
          
          stmt.run(
            idUser, name, birthday, desiredState, gender, word, academicLevel, lat, lon, describeYourself,
            premiumState, idCompatible, idImage, idInfoMore,
            (err) => {
              if (err) {
                res.status(500).json({ error: 'Database error', details: err.message });
              } else {
                stmt.finalize();
                const response = new ResponseInfo({
                  result: 'Success',
                  idInfoMore: idUser,
                  idCompatible: idUser,
                  message: 'Register info success'
                });
                res.json(response);
              }
            }
          );
        }
      });
    });
  }
  
};


module.exports = RegisterController;
