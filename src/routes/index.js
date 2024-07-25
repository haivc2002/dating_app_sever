const clientRouter = require('./clientMobile/auth')

const authRouter = require('./auth/auth_route')



function route(app) {
    //test
    app.use('/client', clientRouter)
    
    app.use('/auth', authRouter);
}
module.exports = route;