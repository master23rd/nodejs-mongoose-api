//make routes
const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require('../controllers/bootcamps')

const router = express.Router()

router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

// routes single path
// router.get('/', getBootcamps)
// router.get('/:id', getBootcamp)
// router.post('/', createBootcamp)
// router.put('/:id', updateBootcamp)
// router.delete('/:id', deleteBootcamp)

module.exports = router
