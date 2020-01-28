const pool = require('../../db/postgres_client.js')
const UserService = require('../../db/user_service.js')
const userService = new UserService(pool)
const Authenticator = require('../middleware/authenticator.js')
const authenticator = new Authenticator();

function userExistsFn(user) {
    console.log(`User with name ${user.userName} already exists!`)
}

module.exports = (app) => {
    app.post('/login', (req, res) => {
        const userName = req.body.user_name
        const password = req.body.password

        authenticator.login(userName, password, (jwt) => {
            res.send({token: jwt})
        })
    })

    app.post('/test_jwt', (req, res) => {
        const beaderHeader = req.headers["authorization"]
        const bearer = beaderHeader.split(" ")
        const bearerToken = bearer[1]
        authenticator.validateJWT(bearerToken, (user) => {
            res.send(user)
        })
    })

    app.post('/new_user', (req, res) => {
        const userName = req.body.user_name
        const password = req.body.password
        const email = req.body.email

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