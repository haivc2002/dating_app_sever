
const User = require('../../models/User');

const AuthController = {
  getLogin: (req, res) => {
    res.render('admin/login');
  },

  
  postLogin: async (req, res) => {
    const { tendangnhap, password } = req.body;
    try {
      const user = await User.findOne({ tendangnhap });
      if (!user) {
        return res.status(404).send('Tài khoản không tồn tại.');
      }
      if (user.password !== password) {
        return res.status(401).send('Sai mật khẩu.');
      }

      req.session.isAuthenticated = true;
      res.redirect('/me/index');
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi server.');
    }
  },


  getRegister: async (req, res) => {
    res.render('register');
  },

  postRegister: (req, res) => {
    const nameR = req.body.nameR;
    const emailR = req.body.emailR;
    const passwordR = req.body.passwordR;
    const avatarR  = req.file ? "http://192.168.1.152:3000/uploadtest/" + path.basename(req.file.path) : "https://i.pinimg.com/564x/29/b8/d2/29b8d250380266eb04be05fe21ef19a7.jpg";

    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS userAdmin (nameR TEXT, emailR TEXT, passwordR TEXT, avatarR TEXT)');
        const stmt = db.prepare('INSERT INTO userAdmin (nameR, emailR, passwordR, avatarR) VALUES (?, ?, ?, ?)');
        stmt.run(nameR, emailR, passwordR, avatarR);
        stmt.finalize();
    });
    res.send('Dữ liệu đã được thêm vào SQLite');
  },
  
  postLogout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/auth/login');
    });
  },


};

module.exports = AuthController;
