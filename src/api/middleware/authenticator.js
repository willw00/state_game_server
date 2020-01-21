const bcrypt = require('bcrypt')

class Authenticator {
    hashPassword(password, fn) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) { 
                console.log(err) 
            }
            
            fn(hash)
        })
    }

    comparePasswords(password, hash, fn, noMatchFn) {
        bcrypt.compare(password, hash, (err, match) => {
            if (err) {
                console.log(err)
            }
            console.log(match)
            if (match === true) {
                console.log("Matched!")
                fn()
            } else {
                console.log("Didn't match!")
                noMatchFn()
            }
        })
    }
}

module.exports = Authenticator