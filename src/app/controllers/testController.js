const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../models/database.db');
const db = new sqlite3.Database(dbPath);


const individualController = {
    viewtest: async (req, res, next) => {
        res.render('viewtest');
    },

    add: async (req, res, next) => {
        const id = req.body.id;
        const name = req.body.name;
        const image  = "http://192.168.1.152:3000/uploadtest/" + path.basename(req.file.path);
        // const image  = "http://192.168.1.152:3000/uploadtest/" + req.body.image;
    
        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS ten_bang_cua_ban (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, image TEXT)');
            const stmt = db.prepare('INSERT INTO ten_bang_cua_ban (id, name, image) VALUES (?, ?, ?)');
            stmt.run(id, name, image);
            stmt.finalize();
        });
        res.send('Dữ liệu đã được thêm vào SQLite');
    },

    showdatajson: async (req, res, next) => {
        db.serialize(() => {
            db.all('SELECT * FROM ten_bang_cua_ban', (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json(rows);
            });
        });
    }
}

module.exports = individualController;