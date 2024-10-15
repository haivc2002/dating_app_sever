const admin = require('firebase-admin');
const serviceAccount = require('../../../serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const NotifyController = {
    push: async (req, res) => {
        try {
          const { title, body, token } = req.body;
    
          if (!title || !body || !token) {
            return res.status(400).json({ message: 'Thiếu title, body hoặc token' });
          }
    
          const message = {
            notification: {
              title: title,
              body: body,
            },
            token: token,
          };

          const response = await admin.messaging().send(message);
          res.status(200).json({ message: 'Thông báo đã gửi thành công', response });
        } catch (error) {
          res.status(500).json({ message: 'Lỗi khi gửi thông báo', error: error.message });
        }
    },
}

module.exports = NotifyController;