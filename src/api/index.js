const auth = require('./routes/auth.js')

module.exports = (app) => {
    auth(app)
}