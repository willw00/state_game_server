const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../../db/postgres_client.js')
const UserService = require('../../db/user_service.js')
const userService = new UserService(pool)

class Authenticator {
    constructor() {
        this.secret = process.env.SECRET_KEY
    }

    hashPassword(password, fn) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) { 
                console.log(err) 
            }
            
            fn(hash)
        })
    }

    login(userName, password, jwtCallback) {
        userService.getUserByName(userName, (user) =>
            bcrypt.compare(password, user.hash, (err, match) => {
                if (err) {
                    console.log(err)
                }
                if (match === true) {
                    this.generateJWT(user, jwtCallback)
                }
            })
        )
    }

    generateJWT(user, jwtCallback) {
        jwt.sign(user.toJSON(), this.secret, (err, jwt) => {
            if (err) {
                console.log(err)
            } else {
                jwtCallback(jwt)
            }
        })
    }

    validateJWT(inputJWT, userCallback) {
        jwt.verify(inputJWT, this.secret, (err, decoded) => {
            if (err) {
                console.log(err)
            }
            userCallback(decoded)
        })
    }
}

module.exports = Authenticator