const pool = require('../../db/postgres_client.js')
const UserService = require('../../db/user_service.js')
const userService = new UserService(pool)
const Authenticator = require('../middleware/authenticator.js')
const authenticator = new Authenticator();

module.exports = (app) => {
    app.post('/login', async (req, res) => {
        const userName = req.body.user_name
        const password = req.body.password
        console.log(req.body)
        const user = await userService.getUserByName(userName)
        console.log(user)
        const jwt = await authenticator.login(user, password)
        if (jwt) {
            res.send({token: jwt})
        } else {
            res.send(`User ${userName} not found or password incorrect.`)
        }
    })

    app.post('/test_jwt', async (req, res) => {
        const beaderHeader = req.headers["authorization"]
        const bearer = beaderHeader.split(" ")
        const bearerToken = bearer[1]
        const user = await authenticator.validateJWT(bearerToken)
        res.send(user)
    })

    app.post('/new_user', async (req, res) => {
        const userName = req.body.user_name
        const password = req.body.password
        const email = req.body.email

        const user = await userService.getUserByName(userName)

        if (!user) {
            const hash = await authenticator.hashPassword(password)
            const newUser = await userService.newUser(userName, hash, email)
            res.send(`Hello ${newUser.userName}!`)
        } else {
            res.send(`User name ${userName} already taken!`)
        }
    })
}