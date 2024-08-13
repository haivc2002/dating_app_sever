const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
var expressLayouts = require('express-ejs-layouts');
const WebSocket = require('ws'); 

const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./config/db');
db.connect();
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const route = require('./routes');
route(app);


const server = app.listen(3000, () =>
  console.log(`App is listening on port http://localhost:3000`)
);

const startWebSocketServer = require('./config/web_socket_config');
startWebSocketServer(server);
