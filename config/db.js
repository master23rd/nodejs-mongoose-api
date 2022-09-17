const mongoose = require('mongoose')

const connectDB = async () => {
  //chain method
  //mongoose.connect().then()

  //async await method
  const conn = await mongoose.connect(process.env.MONGO_URI)
  //   const conn = await mongoose.connect(process.env.MONGO_URI, {
  //     useNewUrlParser: true,
  //     useCreateIndex: true,
  //     useFindAndModify: false,
  //     useUnifiedTopology: true,
  //   })

  console.log(`mongodb connected : ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB
