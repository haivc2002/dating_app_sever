const authRouter = require('./auth/auth_route');
const listNominationRouter = require('./list_nomination');
const match = require('./match');
const update = require('./update');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/data', listNominationRouter);
    app.use('/match', match);
    app.use('/update', update);
}
module.exports = route;