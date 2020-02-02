const rq = require('request')
const rand = require('randomstring')

const userName = 'will' + rand.generate(5)
const pw = 12345

const newInput = {user_name: userName, password:pw, email: 'will@gmail.com'}
rq.post({url:'http://localhost:3000/new_user', form: newInput},
    (err, res, body) => {
        if (err) {
            console.log(err)
        }
        console.log(body)

        const loginInput = {user_name: userName, password: pw}
        rq.post({url:'http://localhost:3000/login', form: loginInput},
            (err, res, body) => {
                if (err) {
                    console.log(err)
                }
                const b = JSON.parse(body)
                const token = b["token"]
                console.log(token)

                rq.post('http://localhost:3000/test_jwt', {'auth': {'bearer': token}}, 
                    (err, res, body) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(body)
                    }
                )
            }
        )
    }
)