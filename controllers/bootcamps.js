const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

// @desc    get all bootcamps
// @routes  GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()
    res
      .status(200)
      .json({ status: 'success', count: bootcamps.length, data: bootcamps })
  } catch (error) {
    // res.status(400).json({ status: false })
    next(error)
  }
}

// @desc    get single bootcamps
// @routes  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    // var formated but not exists
    if (!bootcamp) {
      next(
        new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 400)
      )
      // return res
      //   .status(400)
      //   .json({ status: false, msg: 'bootcamp is not found' })
    }
    res.status(200).json({ status: 'success', data: bootcamp })
  } catch (error) {
    //res.status(400).json({ status: false })

    // handling routes using express
    // next(
    //   new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 400)
    // )

    //refactoring error
    next(error)
  }
}

// @desc    create new  bootcamps
// @routes  Post /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
      success: true,
      data: bootcamp,
    })
    // console.log(req.body)
    // res.status(200).json({ status: 'success', msg: 'created' })
  } catch (error) {
    //res.status(400).json({ success: false, detail: error.errors })
    next(error)
  }
}

// @desc    Update  bootcamps
// @routes  Put /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = async (req, res, next) => {
  try {
    //find and update
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // new data return
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

    //find only
    // const bootcamp = await Bootcamp.findById(req.params.id)
    // if (!bootcamp) throw new Error()
  } catch (error) {
    // res.status(400).json({ success: false })
    next(error)
  }
}

// @desc    delete  bootcamps
// @routes  DEL /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) throw new Error()

    res
      .status(200)
      .json({ success: true, data: {}, msg: 'bootcamp has deleted' })
  } catch (error) {
    // res.status(400).json({ success: false })
    next(error)
  }
}
