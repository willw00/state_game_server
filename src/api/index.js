const auth = require('./routes/auth.js')
const bodyParser = require('body-parser')

module.exports = (app) => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        next();
    })
    auth(app)
}