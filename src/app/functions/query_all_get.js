const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');

class Functions {
    dbAll = (sql, params) => {
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
        
    dbGet = (sql, params) => {
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

    dbRun = (sql, params) => {
      return new Promise((resolve, reject) => {
          db.run(sql, params, function (err) {
              if (err) {
                  reject(err);
              } else {
                  resolve(this.lastID);
              }
          });
        });
    };

    
    calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };
}

module.exports = Functions;