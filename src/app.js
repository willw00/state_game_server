const express = require('express')
const app = express()
const port = 3000
const setRoutes = require('./api/index.js')

setRoutes(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))