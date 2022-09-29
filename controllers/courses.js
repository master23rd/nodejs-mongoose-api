const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')

// @desc    get courses
// @routes  GET /api/v1/courses
// @routes  GET /api/v1/bootcamp/:bootcampId/courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    //populate all data bootcamp
    //query = Course.find().populate('bootcamp')

    //populate specific data bootcamp
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    })
  }

  const courses = await query

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  })
})

// @desc    get course
// @routes  GET /api/v1/course/:courseId
// @access  Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
  })

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`),
      404
    )
  }

  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  })
})

// @desc    Add course
// @routes  POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`),
      404
    )
  }

  const course = await Course.create(req.body)

  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  })
})

// @desc    Update course
// @routes  POST /api/v1/courses/:id
// @access  private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`),
      404
    )
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc    Delete course
// @routes  DELETE  /api/v1/courses/:id
// @access  private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`),
      404
    )
  }
  await course.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
