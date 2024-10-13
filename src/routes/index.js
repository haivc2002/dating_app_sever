const authRouter = require('./auth/auth_route');
const listNominationRouter = require('./list_nomination');
const match = require('./match');
const update = require('./update');
const message = require('./message');
const payment = require('./payment');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/data', listNominationRouter);
    app.use('/match', match);
    app.use('/update', update);
    app.use('/message', message);
    app.use('/payment', payment)
}
module.exports = route;