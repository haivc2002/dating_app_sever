
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
  getSignup: (req, res) => {
    res.render('signup');
  },
  postLogout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/auth/login');
    });
  },
  postSignup: async (req, res) => {
    if (req.session.isAdmin) {
      res.status(403).send('Bạn không có quyền đăng ký.');
    } else {
      const data = {
        tendangnhap: req.body.tendangnhap,
        password: req.body.password
      };

      const existingUser = await User.findOne({ tendangnhap: data.tendangnhap });
      if (existingUser) {
        res.status(400).send('Tên đăng nhập đã tồn tại.');
      } else {
        await User.insertMany([data]);
        res.redirect('http://localhost:3000/auth/login');
      }
    }
  }
};

module.exports = AuthController;
