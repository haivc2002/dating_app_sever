const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
var expressLayouts = require('express-ejs-layouts');
// const bodyParser = require('body-parser');

const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./config/db');
db.connect();
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const route = require('./routes');
route(app);

const port = 3000;
app.listen(port, () =>
  console.log(`App is listening on port http://localhost:${port}`)
);
