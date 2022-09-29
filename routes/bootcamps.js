//make routes
const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
} = require('../controllers/bootcamps')

//resource route
const courseRouter = require('./courses')

const router = express.Router()

//reroute to resources
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius)
router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

// routes single path
// router.get('/', getBootcamps)
// router.get('/:id', getBootcamp)
// router.post('/', createBootcamp)
// router.put('/:id', updateBootcamp)
// router.delete('/:id', deleteBootcamp)

module.exports = router
