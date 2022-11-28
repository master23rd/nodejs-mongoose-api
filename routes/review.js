//make routes
const express = require('express')
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/review')

const Review = require('../models/Review')

// add middleware
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

// re-route from bootcamp
const router = express.Router({ mergeParams: true })

/** advanced middleware */
router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview)

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview)

module.exports = router
