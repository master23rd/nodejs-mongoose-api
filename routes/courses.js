//make routes
const express = require('express')
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses')

const Course = require('../models/Course')

// add middleware
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

// re-route from bootcamp
const router = express.Router({ mergeParams: true })

/** advanced middleware */
router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourse)

/** static middleware */
// router.route('/').get(getCourses).post(addCourse)
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router
