const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');

class Query {
  static tableUser() {
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS user (email TEXT, password TEXT, idUser INT PRIMARY KEY)');
    });
  }

  static tableInfo() {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS info (
          idUser INT,
          name TEXT,
          birthday TEXT,
          desiredState TEXT,
          word TEXT,
          academicLevel TEXT,
          lat REAL,
          lon REAL,
          describeYourself TEXT,
          gender TEXT,
          premiumState TEXT
        )
      `);
    });
  }

  static tableListImage() {
    db.serialize(()=> {
      db.run('CREATE TABLE IF NOT EXISTS listImage (id INT, idUser INT, image TEXT)');
    });
  }

  static tableInfoMore() {
    db.serialize(()=> {
      db.run(`
        CREATE TABLE IF NOT EXISTS infoMore (
          idUser INT,
          height INT,
          wine TEXT,
          somking TEXT,
          zodiac TEXT,
          religion TEXT,
          hometown TEXT
        )
      `);
    });
  }

  static tableMatch() {
    db.serialize(()=> {
      db.run('CREATE TABLE IF NOT EXISTS match (id INT, idUser INT, keyMatch INT)');
      db.run('ALTER TABLE match ADD COLUMN newState BOOLEAN DEFAULT 0', (err) => {
        if (err) {
            if (!err.message.includes("duplicate column name")) {
              console.error('Lỗi khi thêm cột newState:', err.message);
            }
        }
      });
    });
  }

  static updateInfo(info, idUser) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE info SET 
          name = ?, 
          birthday = ?, 
          desiredState = ?, 
          gender = ?, 
          word = ?, 
          academicLevel = ?, 
          lat = ?, 
          lon = ?, 
          describeYourself = ?, 
          premiumState = ?
          WHERE idUser = ?`,
        [
          info.name,
          info.birthday,
          info.desiredState,
          info.gender,
          info.word,
          info.academicLevel,
          info.lat,
          info.lon,
          info.describeYourself,
          info.premiumState,
          idUser
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static updateInfoMore(infoMore, idUser, zodiac) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE infoMore SET 
          height = ?, 
          wine = ?, 
          smoking = ?, 
          zodiac = ?, 
          religion = ?, 
          hometown = ?
          WHERE idUser = ?`,
        [
          infoMore.height,
          infoMore.wine,
          infoMore.smoking,
          zodiac,
          infoMore.religion,
          infoMore.hometown,
          idUser
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static updateImage(image, idUser) {
    return new Promise((resolve, reject) => {
      if (image.id) {
        db.run(
          `UPDATE listImage SET image = ? WHERE id = ? AND idUser = ?`,
          [image.image, image.id, idUser],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      } else {
        db.get('SELECT MAX(id) as maxId FROM listImage', (err, row) => {
          if (err) {
            reject(err);
          } else {
            const id = row.maxId !== null ? row.maxId + 1 : 0;
            db.run(
              `INSERT INTO listImage (id, idUser, image) VALUES (?, ?, ?)`,
              [id, idUser, image.image],
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          }
        });
      }
    });
  }

  static updateLocation(lat, lon, idUser) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE info SET 
          lat = ?, 
          lon = ?
          WHERE idUser = ?`,
        [lat, lon, idUser],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

module.exports = Query;
