const meRouter = require('./me');
const dienthoaisRouter = require('./dienthoai');
const homeRouter = require('./home');
const authRouter = require('./auth');
const artRouter = require('./art');


function route(app) {
    app.use('/me', meRouter)
    app.use('/', homeRouter)
    app.use('/dienthoais', dienthoaisRouter)
    app.use('/auth', authRouter);
    app.use('/art', artRouter);
}
module.exports = route;