const pool = require('../../db/postgres_client.js')
const UserService = require('../../db/user_service.js')
const userService = new UserService(pool)
const Authenticator = require('../middleware/authenticator.js')
const authenticator = new Authenticator();

function userExistsFn(user) {
    console.log(`User with name ${user.userName} already exists!`)
}

module.exports = (app) => {
    app.get('/login', (req, res) => {
        const userName = req.query.user_name
        const password = req.query.password

        authenticator.login(userName, password, (jwt) => {
            res.send(`JWT: ${jwt}`)
        })
    })

    app.get('/test_jwt', (req, res) => {
        const jwt = req.query.jwt
        authenticator.validateJWT(jwt, (user) => {
            res.send(user)
        })
    })

    app.get('/new_user', (req, res) => {
        const userName = req.query.user_name
        const password = req.query.password
        const email = req.query.email

        userService.getUserByName(
            userName, 
            userExistsFn,
            (userName) => authenticator.hashPassword(password, (hash) => {
                userService.newUser(userName, hash, email, (user) => {
                    res.send(`Hello ${user.userName}!`)
                })
            })
        )
    })
}