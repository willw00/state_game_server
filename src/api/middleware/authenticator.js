const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../../db/postgres_client.js')
const UserService = require('../../db/user_service.js')
const userService = new UserService(pool)

class Authenticator {
    constructor() {
        this.secret = process.env.SECRET_KEY
    }

    async hashPassword(password) {
        return bcrypt.hash(password, 10)
    }

    async login(user, password) {
        try {
            const match = await bcrypt.compare(password, user.hash)
            if (match === true) {
                return jwt.sign(user.toJSON(), this.secret)
            } else {
                return null
            }
        } catch (err) {
            console.log(err.stack)
        }
    }

    async validateJWT(inputJWT) {
        return jwt.verify(inputJWT, this.secret)
    }
}

module.exports = Authenticator