//make routes
const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
  getBootcampInRadius,
} = require('../controllers/bootcamps')

const Bootcamp = require('../models/Bootcamp')

const advancedResults = require('../middleware/advancedResults')

//resource route
const courseRouter = require('./courses')
const reviewRouter = require('./review')

const router = express.Router()

//add middleware auth
const { protect, authorize } = require('../middleware/auth')

//reroute to resources
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

/** static middleware */
// router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius)
router.route('/:id/photo').put(bootcampPhotoUpload)

/** advanced middleware - fetch data dynamicly */
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp)

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

// routes single path
// router.get('/', getBootcamps)
// router.get('/:id', getBootcamp)
// router.post('/', createBootcamp)
// router.put('/:id', updateBootcamp)
// router.delete('/:id', deleteBootcamp)

module.exports = router
