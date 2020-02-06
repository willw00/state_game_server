const userService = require('../../db/user_service.js')()

module.exports = (app) => {
    app.post('/login', async (req, res) => {
        const userName = req.body.user_name
        const password = req.body.password
        const jwt = await userService.login(userName, password)
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
        const user = await userService.validateUser(bearerToken)
        res.send(user)
    })

    app.post('/new_user', async (req, res) => {
        const userName = req.body.user_name
        const password = req.body.password
        const email = req.body.email

        const newUser = await userService.newUser(userName, password, email)

        if (newUser) {
            res.send(`Hello ${newUser.userName}!`)
        } else {
            res.send(`User name ${userName} already taken!`)
        }
    })
}