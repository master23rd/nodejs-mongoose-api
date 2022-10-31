const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')

// @desc    get all bootcamps
// @routes  GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // single function
  // console.log(req.query)

  // // copy req. query to new object
  // const reqQuery = { ...req.query }
  // console.log(reqQuery)

  // //exclude fields
  // const removeFields = ['select', 'sort', 'page', 'limit']

  // //loop over removeFields and delete from queryStr
  // removeFields.forEach((param) => delete reqQuery[param])

  // //create query string
  // let queryStr = JSON.stringify(reqQuery)
  // console.log(queryStr)

  // //create operator gt, gte, lt etc
  // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  // console.log(`result : ${queryStr}`)

  // //using mongodb string find query find({ "averageCost" : {"$lte": "1000"}, "location.city": "boston" "})
  // query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

  // //select process
  // if (req.query.select) {
  //   const fields = req.query.select.split(',').join(' ')
  //   console.log(fields) // "name description" sintaks for mongoose query

  //   query = query.select(fields)
  // }

  // //sortby or default(using date)
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ')
  //   query = query.sort(sortBy) //default ascending
  // } else {
  //   query = query.sort('-createdAt') // descending
  // }

  // const page = parseInt(req.query.page, 10) || 1 //selected page
  // const limit = parseInt(req.query.limit, 10) || 25 //show n-th items
  // const startIndex = (page - 1) * limit //skip several items , ex. page 2 will start from 6th item.
  // const endIndex = page * limit //last index of total item fetch
  // const total = await Bootcamp.countDocuments() //total document to fetch

  // //pagination skip and limit function
  // query = query.skip(startIndex).limit(limit)

  // //execute query
  // const bootcamps = await query

  // const pagination = {}

  // //if last index item (in page) less then total - still have amount
  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit: limit,
  //   }
  // }

  // //if startIndex in page 1 or begin indexing
  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   }
  // }

  //const bootcamps = await Bootcamp.find(req.query)
  // res.status(200).json({
  //   status: 'success',
  //   count: bootcamps.length,
  //   pagination,
  //   data: bootcamps,
  // })

  /** advanced result */
  res.status(200).json(res.advancedResults)
})

// @desc    get single bootcamps
// @routes  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  // variable formated but not exists
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 400)
    )
  }
  res.status(200).json({ status: 'success', data: bootcamp })
})

// @desc    create new  bootcamps
// @routes  Post /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({
    success: true,
    data: bootcamp,
  })
})

// @desc    Update  bootcamps
// @routes  Put /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  //find and update
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // new data return - set
    runValidators: true, //run validator mongoose
  })

  if (!bootcamp) {
    //throw new Error()
    //res.status(400).json({ success: false, msg: 'bootcamp not found' })
    next(
      new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 400)
    )
  }

  res.status(200).json({ success: true, data: bootcamp })
})

// @desc    delete  bootcamps
// @routes  DEL /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  // const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) throw new Error()

  //trigger hooks pre
  bootcamp.remove()

  res.status(200).json({ success: true, data: {}, msg: 'bootcamp has deleted' })
})

// @desc    Get bootcamps within radius and zipcode (you can change to lng-lat)
// @routes  GET /api/v1/bootcamps/radius/:zipcode/:distance /:type (distance type ex. mil, km)
// @access  private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  // get lang/lang from gecodoer
  const loc = await geocoder.geocode(zipcode)
  //loc will return array object
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  //calc radius using radians
  // devide distance by radius of earth
  // earth radius = 3,963 in mill ||  6,378 km
  //using mile
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})

// @desc    upload photo for bootcamp
// @routes  PUT /api/v1/bootcamps/:id/photo
// @access  private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 400)
    )
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a file`, 400))
  }

  // console.log(req.files.file)
  const file = req.files.file

  //make sure file is image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please Upload a image file`, 400))
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err)
      return next(new ErrorResponse(`Proble with upload`, 400))
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
    res.status(200).json({
      success: true,
      data: file.name,
    })
  })
  console.log(file.name)
})
