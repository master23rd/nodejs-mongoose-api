const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const User = require('../models/User')

// @desc    Register user
// @routes  POST /api/v1/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  sendTokenResponse(user, 200, res)
})

// @desc    Login user
// @routes  POST /api/v1/login
// @access  private
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  //validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('please provide an email and password', 400))
  }

  // check for user
  const user = await User.findOne({
    email: email,
  }).select('+password')

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  //check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  //create token
  //   const token = user.getSignedJwtToken()
  //   res.status(200).json({ success: true, token: token })
  sendTokenResponse(user, 200, res)
})

// @desc    Log out user / clear cookie
// @routes  GET /api/v1/auth/logout
// @access  private
exports.logout = asyncHandler(async (req, res, next) => {
  //clear cookie to none value , will expires in 10 seconds
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    get current logged in user
// @routes  GET /api/v1/auth/me
// @access  private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    update user details
// @routes  PUT /api/v1/auth/updatedetails
// @access  private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update Password
// @routes  PUT /api/v1/auth/updatepassword
// @access  private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('password is incorect', 401))
  }

  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

// @desc    Forget Password
// @routes  GET /api/v1/auth/forgotpassword
// @access  private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  //check if not user
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404))
  }

  //get reset token
  const resetToken = user.getResetPasswordToken()

  //store to database
  await user.save({ validateBeforeSave: false })

  //create user url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `you are receiving this email , because some reset their password \n\n ${resetUrl}`

  //sendEmail
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset',
      message,
    })
    res.status(200).json({ success: true, data: 'email sent' })
  } catch (error) {
    console.log(error)
    user.resetPasswordToken = undefined
    user.resetPasswordExpired = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }

  // res.status(200).json({
  //   success: true,
  //   data: user,
  // })
})

// @desc    Reset Password
// @routes  PUT /api/v1/auth/resetpassword/:resettoken
// @access  public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  //const user = await User.findById(req.user.id)

  //find user by tokens
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  })

  //if not exist
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400))
  }

  //set new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpired = undefined

  await user.save()

  sendTokenResponse(user, 200, res)

  // res.status(200).json({
  //   success: true,
  //   data: user,
  // })
})

// get Token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token })
}
