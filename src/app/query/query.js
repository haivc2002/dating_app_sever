const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

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
          premiumState TEXT,
          idCompatible INT,
          idImage INT,
          idInfoMore INT
        )
      `);
    });
  }
}

module.exports = Query;
