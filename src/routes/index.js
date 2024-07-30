const authRouter = require('./auth/auth_route');
const listNominationRouter = require('./list_nomination');
const match = require('./match');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/data', listNominationRouter);
    app.use('/match', match);
}
module.exports = route;