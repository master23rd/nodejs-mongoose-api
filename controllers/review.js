const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @desc    get courses
// @routes  GET /api/v1/courses
// @routes  GET /api/v1/bootcamp/:bootcampId/courses
// @access  Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc    get review
// @routes  GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!review) {
    return next(
      new ErrorResponse(`no review found with the id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    status: true,
    data: review,
  })
})

// @desc    add review to bootcamp
// @routes  POST /api/v1/bootcamp/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp with Id ${req.params.bootcampId}`)
    )
  }

  const review = await Review.create(req.body)

  res.status(200).json({
    status: true,
    data: review,
  })
})

// @desc    update review
// @routes  PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(new ErrorResponse(`No Review with id ${req.params.id}`, 404))
  }

  //make sure review belongs to user owner
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`No authorized to update with id ${req.params.id}`, 401)
    )
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: review,
  })
})

// @desc    delete review
// @routes  DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  if (!review) {
    return next(new ErrorResponse(`no review with id ${req.params.id}`))
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`no authorized to update review`))
  }

  await review.remove()

  const reviews = await Review.find({ bootcamp: req.params.bootcampId })

  res.status(200).json({
    success: true,
    data: reviews,
  })
})
