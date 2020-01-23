const User = require('../models/user.js');

class UserService {
    constructor(connectionPool) {
        this.connectionPool = connectionPool;
    }

    newUser(userName, passwordHash, email, callback) {
        this.connectionPool.query("INSERT INTO users (user_name, pw_hash, email) VALUES ($1, $2, $3)", [userName, passwordHash, email], (err, res) => {
            if (err) {
                console.log(err)
                throw err
            }
            if (res.rowCount > 0) {
                const user = new User(0, userName, email)
                callback(user)
            }
        })
    } 

    getUserById(userId, userCallback, notFoundCallback) {
        console.log("Querying a user by id!")
        this.connectionPool.query("SELECT * FROM users WHERE id = $1", [userId], (err, res) => {
            if (err) {
                console.log(err)
                throw err
            }
            if (res.rows.length > 0) {
                const u = res.rows[0];
                const user = new User(u.id, u.user_name, u.email, u.pw_hash)
                console.log(user)
                userCallback(user)
            } else {
                if (notFoundCallback) {
                    notFoundCallback(userId)
                }
                else {
                    console.log('No user found with id', userId)
                }
            }
        })
    }

    getUserByName(userName, foundCallback, notFoundCallback) {
        console.log("Querying a user by name!")
        this.connectionPool.query("SELECT * FROM users WHERE user_name = $1", [userName], (err, res) => {
            if (err) {
                console.log(err)
                throw err
            }
            if (res.rows.length > 0) {
                const u = res.rows[0];
                const user = new User(u.id, u.user_name, u.email, u.pw_hash)
                console.log(user)
                foundCallback(user)
            } else {
                if (notFoundCallback) {
                    notFoundCallback(userName)
                }
                else {
                    console.log('No user found with user_name', userName)
                }
            }
        })
    }

    getUserHash(userName, foundCallback, notFoundCallback) {
        this.connectionPool.query("SELECT * FROM users WHERE user_name = $1", [userName], (err, res) => {
            if (err) {
                console.log(err)
                throw err
            }
            if (res.rows.length > 0) {
                const hash = res.rows[0].pw_hash
                foundCallback(hash)
            } else {
                if (notFoundCallback) {
                    notFoundCallback(userName)
                }
                else {
                    console.log('No user found with user_name', userName)
                }
            }
        })
    }
}

module.exports = UserService