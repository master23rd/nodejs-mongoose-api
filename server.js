const express = require('express')
const dotenv = require('dotenv')

//load env variables
dotenv.config({ path: './config/config.env' })

const app = express()

//make routes
app.get('/', (req, res) => {
  res.send('hello from express')
})

const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(`running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
