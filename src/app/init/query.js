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
    });
  }
}

module.exports = Query;
