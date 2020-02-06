const User = require('../models/user.js');
const connectionPool = require('./postgres_client.js')
const authenticator = require('../auth/authenticator.js')()

module.exports = () => {
    return {
        async createUser(userName, passwordHash, email) {
            try {
                const res = await connectionPool.query("INSERT INTO users (user_name, pw_hash, email) VALUES ($1, $2, $3)", [userName, passwordHash, email])
                const resRow = res[0]
                const user = new User(resRow.id, resRow.userName, resRow.email)
                return user
            } catch (err) {
                console.log(err.stack)
            }
        },

        async getUserById(userId) {
            console.log("Querying a user by id!")
            try {
                const res = await connectionPool.query("SELECT * FROM users WHERE id = $1", [userId])

                const u = res.rows[0];
                const user = new User(u.id, u.user_name, u.email, u.pw_hash)
                return user
            } catch (err) {
                console.log(err.stack)
            }
        },

        async getUserByName(userName) {
            console.log("Querying a user by name!")
            try { 
                const res = await connectionPool.query("SELECT * FROM users WHERE user_name = $1", [userName])
                if (res.rows.length == 0) {
                    console.log('No user found with user_name', userName)
                    return null
                }
                const u = res.rows[0];
                return new User(u.id, u.user_name, u.email, u.pw_hash)
            } catch (err) {
                console.log(err.stack)
            }
        },

        async newUser(userName, password, email) {
            const user = await this.getUserByName(userName)
            if (!user) {
                const hash = await authenticator.hashPassword(password)
                const newUser = await this.createUser(userName, hash, email) 
                return newUser
            } else {
                return null
            }
        },

        async login(userName, password) {
            const user = await this.getUserByName(userName)
            const jwt = await authenticator.login(user.hash, password)
            return jwt
        },

        async validateUser(bearerToken) {
            const user = await authenticator.validateJWT(bearerToken)
            return user
        }
    }
}