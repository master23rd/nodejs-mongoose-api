// @desc    get all bootcamps
// @routes  GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ status: 'success', msg: 'show all' })
}

// @desc    get single bootcamps
// @routes  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ status: 'success', msg: `display bootcamp ${req.params.id}` })
}

// @desc    create new  bootcamps
// @routes  Post /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ status: 'success', msg: 'created' })
}

// @desc    Update  bootcamps
// @routes  Put /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ status: 'success', msg: `update bootcamp ${req.params.id}` })
}

// @desc    delete  bootcamps
// @routes  DEL /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ status: 'success', msg: `delete bootcamp ${req.params.id}` })
}
