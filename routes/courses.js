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
const advancedResults = require('../middleware/advancedResults')

// re-route from bootcamp
const router = express.Router({ mergeParams: true })

/** static middleware */
// router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)

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
  .post(addCourse)

module.exports = router
