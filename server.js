const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('errorhandler')
const morgan = require('morgan')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 4001
const apiRouter = require('./api/api')

app.use(bodyParser.json())

app.use(morgan('dev'))
app.use(cors())

app.use('/api', apiRouter)
app.use(errorHandler())

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))

module.exports = app
