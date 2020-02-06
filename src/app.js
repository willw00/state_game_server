const express = require('express')
const setRoutes = require('./api/index.js')
const app = express()
const port = 3000


setRoutes(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))