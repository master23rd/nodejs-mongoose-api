const path = require('path')
const express = require('express') // express lib
const dotenv = require('dotenv') //for env config
const morgan = require('morgan') //for log
const colors = require('colors') //cl colors
const fileupload = require('express-fileupload') //upload file
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser') //for parsing body request
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

//load env variables
dotenv.config({ path: './config/config.env' })

//log middleware >> replace use morgan
//const logger = require('./middleware/logger')

connectDB()

//routes files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/review')

//make variable express
const app = express()

//body parser
//app.use(bodyParser.json())
app.use(express.json())

//cookie parser
app.use(cookieParser())

//dev logging middleware (using morgan)
// help to logging error or request process capturize - req.method} ${req.protocol}
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// mount express file upload
app.use(fileupload())
app.use(express.static(path.join(__dirname, 'public')))

//define middleware (manually)
//app.use(logger)

//mount router
app.use('/api/v1/auth', auth)
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

//error response middleware - trigger by next
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(
  PORT,
  console.log(
    `running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

// read cycle process on, promise to handle reject
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  server.close(() => process.exit(1))
})
