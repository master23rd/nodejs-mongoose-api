const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

// @desc    get all bootcamps
// @routes  GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find()
  res
    .status(200)
    .json({ status: 'success', count: bootcamps.length, data: bootcamps })
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
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

  if (!bootcamp) throw new Error()

  res.status(200).json({ success: true, data: {}, msg: 'bootcamp has deleted' })
})
