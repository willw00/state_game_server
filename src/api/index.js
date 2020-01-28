const auth = require('./routes/auth.js')
const bodyParser = require('body-parser')

module.exports = (app) => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    auth(app)
}