const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

//define env variable
dotenv.config({ path: './config/config.env' })

//load model
const Bootcamp = require('./models/Bootcamp')

//connect database
connectDB()

//read jsonfiles
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)

//import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    console.log('data imported..'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

//import into db
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    console.log('data being destory..'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
