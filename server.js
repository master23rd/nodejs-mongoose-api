const express = require('express')
const dotenv = require('dotenv') //for env config
const morgan = require('morgan') //for log
const colors = require('colors') //cl colors
const bodyParser = require('body-parser')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

//load env variables
dotenv.config({ path: './config/config.env' })

//log middleware >> replace use morgan
//const logger = require('./middleware/logger')

connectDB()

//routes files
const bootcamps = require('./routes/bootcamps')

//make variable express
const app = express()

//body parser
app.use(bodyParser.json())

//dev logging middleware (using morgan)
// help to logging error or request process capturize - req.method} ${req.protocol}
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//define middleware (manually)
//app.use(logger)

//mount router
app.use('/api/v1/bootcamps', bootcamps)

//error response middleware - trigger by next
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(
  PORT,
  console.log(
    `running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  server.close(() => process.exit(1))
})
