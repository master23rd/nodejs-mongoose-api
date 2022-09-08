const express = require('express')
const dotenv = require('dotenv')

//load env variables
dotenv.config({ path: './config/config.env' })

const app = express()

//make routes
app.get('/', (req, res) => {
  //response html/string
  //res.send('hello from express')

  //response json
  //res.send({ name: 'adam' })

  //chaining response
  res.status(200).json({ status: 'success', data: { id: 1 } })
})

app.get('/api/v1/bootcamps', (req, res) => {
  res.status(200).json({ status: 'success', msg: 'show all' })
})

app.get('/api/v1/bootcamps/:id', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', msg: `display bootcamp ${req.params.id}` })
})

app.post('/api/v1/bootcamps', (req, res) => {
  res.status(200).json({ status: 'success', msg: 'created' })
})

app.put('/api/v1/bootcamps/:id', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', msg: `update bootcamp ${req.params.id}` })
})

app.delete('/api/v1/bootcamps/:id', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', msg: `delete bootcamp ${req.params.id}` })
})

const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(`running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
