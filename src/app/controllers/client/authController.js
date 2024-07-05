const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../models/database.db');
const db = new sqlite3.Database(dbPath);

const authController = {

    registerAPI: async (req, res, next) => {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const avatar  = req.file ? "http://192.168.1.152:3000/uploadtest/" + path.basename(req.file.path) : "https://i.pinimg.com/564x/29/b8/d2/29b8d250380266eb04be05fe21ef19a7.jpg";
    
        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS userClient (name TEXT, email TEXT, password TEXT, avatar TEXT)');
            const stmt = db.prepare('INSERT INTO userClient (name, email, password, avatar) VALUES (?, ?, ?, ?)');
            stmt.run(name, email, password, avatar);
            stmt.finalize();
        });
        res.send('Dữ liệu đã được thêm vào SQLite');
    },

    loginAPI: async (req, res, next) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
    
            db.get('SELECT * FROM userClient WHERE email = ? AND password = ?', [email, password], (err, row) => {
                if (err) {
                    throw err;
                }
    
                if (row) {
                    res.status(200).json({
                        message: 'Đăng nhập thành công',
                        user: {
                            email: row.email,
                            name: row.name,
                            avatar: row.avatar,
                        },
                    });
                } else {
                    res.status(401).json({
                        message: 'Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.',
                    });
                }
            });
        } catch (error) {
            console.error('Error in loginAPI:', error);
            next(error);
        }
    },

    // datauserjsonAPI: async (req, res, next) => {
    //     db.serialize(() => {
    //         db.all('SELECT * FROM userClient', (err, rows) => {
    //             if (err) {
    //                 return res.status(500).json({ error: 'Internal Server Error' });
    //             }
    //             res.json(rows);
    //         });
    //     });
    // },

    showjsontest: async (req, res, next) => {
        db.serialize(() => {
            db.all('SELECT * FROM test', (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json(rows);
            });
        });
    },

    datauserjsonAPI: async (req, res, next) => {
        db.serialize(() => {
            db.all('SELECT userClient.name, userClient.password, userClient.avatar, test.email, test.list FROM userClient LEFT JOIN test ON userClient.email = test.email', (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
    
                const result = {};
                rows.forEach(row => {
                    if (!result[row.name]) {
                        result[row.name] = {
                            name: row.name,
                            email: [],
                            password: row.password,
                            avatar: row.avatar
                        };
                    }
    
                    result[row.name].email.push({
                        email: row.email,
                        list: row.list
                    });
                });
    
                res.json(Object.values(result));
            });
        });
    }
    

    
    
}

module.exports = authController;