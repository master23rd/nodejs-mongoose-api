//make routes
const express = require('express')
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user')

const User = require('../models/User')

// re-route from bootcamp
const router = express.Router({ mergeParams: true })

// add middleware
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin'))

/** advanced middleware */
router.route('/').get(advancedResults(User), getUsers).post(createUser)

/** static middleware */
// router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
