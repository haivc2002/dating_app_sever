const meRouter = require('./me');
const authRouter = require('./auth');
const artRouter = require('./art');
const visitorRouter = require('./visitor')
const clientRouter = require('./clientMobile/auth')
const adminRouter = require('./adminWeb/auth')
const testRouter = require('./test')


function route(app) {
    app.use('/me', meRouter)
    app.use('/auth', authRouter);
    app.use('/art', artRouter);
    app.use('/visitor', visitorRouter)
    //test
    app.use('/test', testRouter)
    app.use('/client', clientRouter)
    app.use('/admin', adminRouter)
}
module.exports = route;