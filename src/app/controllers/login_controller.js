
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');
const ResponseLogin = require('../models/auth/response_login'); 
const RegisterFunction = require('../functions/register_function');
const { userInfo } = require('os');

const functions = new RegisterFunction();


const dbAll = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };
  
  const dbGet = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  };
  
  const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const handleError = ({ result, message, status }) => {
      const response = new ResponseLogin({
        result: result,
        message: message,
      });
      return res.status(status).json(response);
    };
  
    try {
      if (!email || !password || email.trim() === '' || password.trim() === '') {
        return handleError({
          result: 'Error',
          message: 'Email, Password cannot be null or empty',
          status: 200
        });
      } else if (functions.containsVietnameseCharacters(email) || functions.containsVietnameseCharacters(password)) {
        return handleError({
          result: 'Error',
          message: 'Cannot format',
          status: 200
        });
      }
  
      const user = await dbGet('SELECT idUser, password FROM user WHERE email = ?', [email]);
  
      if (!user) {
        return handleError({
          result: 'Error',
          message: 'Account does not exist',
          status: 200
        });
      } else if (user.password !== password) {
        return handleError({
          result: 'Error',
          message: 'Incorrect password',
          status: 200
        });
      }
  
      const userInfo = await dbGet('SELECT * FROM info WHERE idUser = ?', [user.idUser]);
      const images = await dbAll('SELECT * FROM listImage WHERE idUser = ?', [user.idUser]);
      const infoMore = await dbGet('SELECT * FROM infoMore WHERE idUser = ?', [user.idUser]);
  
      const response = new ResponseLogin({
        result: 'Success',
        message: 'OK',
        idUser: user.idUser,
        email: email,
        listImage: images,
        info: userInfo || {},
        infoMore: infoMore
      });
  
      res.json(response);
    } catch (err) {
      return handleError({
        result: 'Error',
        message: 'Error querying the database',
        status: 500
      });
    }
  };

module.exports = { login };