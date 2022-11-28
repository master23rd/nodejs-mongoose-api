const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'please add a title for review'],
    maxLength: 100,
  },
  text: {
    type: String,
    required: [true, 'please add a text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'please add rating betwen 1 and 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})
//prevent user submit more than 1 times in bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true })

// static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  // console.log('calculating'.blue)

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ])

  console.log(obj)

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      // make even number
      averageRating: obj[0].averageRating,
    })
  } catch (error) {
    console.log(error)
  }
}

// call getAvarageCost after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp)
})

// call getAvarageCost before remove
ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.bootcamp)
})

module.exports = mongoose.model('Review', ReviewSchema)
