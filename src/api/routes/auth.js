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

        userService.getUserHash(userName, 
            (hash) => {
                authenticator.comparePasswords(
                    password, 
                    hash, 
                    () => { res.send(`User: ${userName} authenticated!`) }, 
                    () => { res.send(`User: ${userName} not found or password incorrect!`) })
            },
            (userName) => res.send(`User: ${userName} not found or password incorrect`)
        )
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