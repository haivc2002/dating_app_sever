const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');
const ResponseRegister = require('../models/auth/response_register');
const ResponseInfo = require('../models/auth/response_infor');
const ResponseImage = require('../models/auth/response_image');
const RegisterFunction = require('../functions/register_function');
const Query = require('../init/query');
const nodemailer = require('nodemailer');
const path = require('path');


Query.tableUser();
Query.tableInfo();
Query.tableListImage();
Query.tableInfoMore();

const functions = new RegisterFunction();

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
        result: 'Error',
        message: 'Email or password cannot be null or empty',
        status: 200
      });
    } else if (functions.containsVietnameseCharacters(email) || functions.containsVietnameseCharacters(password)) {
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
            result: 'Error',
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
              result: 'Success',
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
      height,
      wine,
      smoking,
      religion,
      hometown
    } = req.body;
  
    const premiumState = false;
  
    const response = functions.checkNull('idUser null or empty', idUser);
    if (response) {
      return res.status(200).json(response);
    }
  
    const [day, month, year] = birthday.split('/').map(Number);
    const zodiac = functions.getZodiacSign(day, month);
  
    db.serialize(() => {
      db.get('SELECT idUser FROM info WHERE idUser = ?', [idUser], (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        } else if (row) {
          const response = new ResponseInfo({
            result: 'Error',
            message: 'User ID already exists'
          });
          return res.status(200).json(response);
        } else {
          const stmtInfo = db.prepare(`INSERT INTO info (
            idUser, name, birthday, desiredState, gender, word, academicLevel, lat, lon, describeYourself, 
            premiumState
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
          stmtInfo.run(
            idUser, name, birthday, desiredState, gender, word, academicLevel, lat, lon, describeYourself, premiumState,
            (err) => {
              if (err) {
                return res.status(500).json({ error: 'Database error', details: err.message });
              } else {
                stmtInfo.finalize();
  
                const stmtInfoMore = db.prepare(`INSERT INTO infoMore (
                  idUser, height, wine, smoking, zodiac, religion, hometown
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  
                stmtInfoMore.run(
                  idUser, height, wine, smoking, zodiac, religion, hometown,
                  (err) => {
                    if (err) {
                      return res.status(500).json({ error: 'Database error', details: err.message });
                    } else {
                      stmtInfoMore.finalize();
                      const response = new ResponseInfo({
                        result: 'Success',
                        idUser: idUser,
                        message: 'Register info success'
                      });
                      return res.json(response);
                    }
                  }
                );
              }
            }
          );
        }
      });
    });
  },

  addImage: (req, res) => {
    const image = "http://192.168.70.123:3000/uploads/" + path.basename(req.file.path);
    const idUser = req.body.idUser;

    if (!idUser || idUser.trim() === '') {
      const response = new ResponseImage({
        result: 'Error',
        message: 'User ID cannot be null or empty'
      });
      return res.status(200).json(response);
    }

    db.get('SELECT MAX(id) as maxId FROM listImage', (err, row) => {

      if (err) {
        const response = new ResponseImage({
          result: 'Error',
          message: 'Error querying the database',
        });
        return res.status(200).json(response);
      }
      const id = row.maxId !== null ? row.maxId + 1 : 0;

      const request = db.prepare('INSERT INTO listImage (id, idUser, image) VALUES (?,?,?)');
      request.run(id, idUser, image, (err) => {
        if (err) {
          const response = new ResponseImage({
            result: 'Error',
            message: 'Cannot insert data'
          });
          return res.status(200).json(response);
        }

        request.finalize();
        const response = new ResponseImage({
          result: 'Success',
          message: 'Ok'
        });
        res.json(response);
      });
    })
  },

  registerInfoMore: (req, res) => {
    const {
      idUser,
      height,
      wine,
      smoking,
      zodiac,
      religion,
      hometown
    } = req.body;

    const response = functions.checkNull('idUser null or empty!', idUser);
    if (response) {
      return res.status(200).json(response);
    }


    db.serialize(()=> {
      db.get('SELECT idUser FROM infoMore WHERE idUser = ?', [idUser], (err, row) => {
        if(err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        } else if(row) {
          const response = new ResponseInfo({
            result: 'Error',
            message: 'User ID already exists',
          })
          return res.status(200).json(response);
        } else {
          const request = db.prepare(`
            INSERT INTO infoMore (idUser, height, wine, smoking, zodiac, religion, hometown)
            VALUES (?,?,?,?,?,?,?)  
          `);

          request.run(
            idUser, height, wine, smoking, zodiac, religion, hometown, (err) => {
              if(err) {
                return res.status(500).json({ error: 'Database error', details: err.message });
              } else {
                request.finalize();
                const response = new ResponseInfo({
                  result: 'Success',
                  message: 'OK',
                  idUser: idUser,
                });
                return res.json(response);
              }
            }
          )
        }
      })
    });
  },
};

module.exports = RegisterController;
