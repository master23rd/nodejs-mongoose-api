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

const router = express.Router()

//reroute to resources
router.use('/:bootcampId/courses', courseRouter)

/** static middleware */
// router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius)
router.route('/:id/photo').put(bootcampPhotoUpload)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

/** advanced middleware - fetch data dynamicly */
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp)

// routes single path
// router.get('/', getBootcamps)
// router.get('/:id', getBootcamp)
// router.post('/', createBootcamp)
// router.put('/:id', updateBootcamp)
// router.delete('/:id', deleteBootcamp)

module.exports = router
