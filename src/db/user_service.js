const User = require('../models/user.js');

class UserService {
    constructor(connectionPool) {
        this.connectionPool = connectionPool;
    }

    async newUser(userName, passwordHash, email) {
        try {
            await this.connectionPool.query("INSERT INTO users (user_name, pw_hash, email) VALUES ($1, $2, $3)", [userName, passwordHash, email])

            const user = new User(0, userName, email)
            return user
        } catch (err) {
            console.log(err.stack)
        }
    } 

    async getUserById(userId) {
        console.log("Querying a user by id!")
        try {
            const res = await this.connectionPool.query("SELECT * FROM users WHERE id = $1", [userId])

            const u = res.rows[0];
            const user = new User(u.id, u.user_name, u.email, u.pw_hash)
            return user
        } catch (err) {
            console.log(err.stack)
        }
    }

    async getUserByName(userName) {
        console.log("Querying a user by name!")
        try { 
            const res = await this.connectionPool.query("SELECT * FROM users WHERE user_name = $1", [userName])
            if (res.rows.length == 0) {
                console.log('No user found with user_name', userName)
                return null
            }
            const u = res.rows[0];
            return new User(u.id, u.user_name, u.email, u.pw_hash)
        } catch (err) {
            console.log(err.stack)
        }
    }
}

module.exports = UserService