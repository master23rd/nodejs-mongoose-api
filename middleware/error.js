const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message
  // log for developer
  console.log(err)
  console.log(err.name)

  //detect specific error
  //mongoose error for bad object Id
  if (err.name === 'CastError') {
    const message = `Resource not found with ID of ${err.value}`
    error = new ErrorResponse(message, 404)
  }
  //mongoose error duplicate data
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new ErrorResponse(message, 400)
  }
  //mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  //console.log(err.name)

  // print error to response & default error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  })
}

module.exports = errorHandler
