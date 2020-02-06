const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const secret = process.env.SECRET_KEY

module.exports = () => {
    return {
        async hashPassword(password) {
            return bcrypt.hash(password, 10)
        },

        async login(user, password) {
            try {
                const match = await bcrypt.compare(password, user.hash)
                if (match === true) {
                    return jwt.sign(user.toJSON(), secret)
                } else {
                    return null
                }
            } catch (err) {
                console.log(err.stack)
            }
        },

        async validateJWT(inputJWT) {
            return jwt.verify(inputJWT, secret)
        }
    }
}