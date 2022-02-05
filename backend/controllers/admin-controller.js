// Import User Model
const User = require('../models/user-model')
const Pay = require('../models/pay-model')
const {
  handleError,
  handleErrorWithStatus,
  strictValidArrayWithMinLength,
  generateValidationsErrors,
  strictValidObjectWithKeys,
} = require('../helper/utils')

// Handle get Users actions
exports.GetUsers = async (_, res) => {
  try {
    const users = await User.find()
    if (strictValidArrayWithMinLength(users, 1)) {
      res.status(200).json({
        success: true,
        data: users,
      })
    } else {
      handleErrorWithStatus(res, 404, 'User not found!')
    }
  } catch (err) {
    handleError(res, 'Something wents wrong. Try again later!')
  }
}

// Handle Get Payments
exports.GetPayments = async (_, res) => {
  try {
    const payments = await Pay.find()
    if (strictValidArrayWithMinLength(payments, 1)) {
      res.status(200).json({
        success: true,
        data: payments,
      })
    } else {
      handleErrorWithStatus(res, 404, 'No payments found!', { status: 'info' })
    }
  } catch (err) {
    handleError(res, 'Something wents wrong. Try again later!')
  }
}

// Handle Update Payment Status
exports.UpdatePaymentStatus = async (req, res) => {
  try {
    const { id, status } = req.body
    if (id && status) {
      const payment = await Pay.findById({ _id: id })
      console.log(payment, status)
      if (strictValidObjectWithKeys(payment)) {
        const r = await Pay.updateOne({ _id: id }, { $set: { status } })
        console.log(r.modifiedCount)
        res.status(200).json({
          success: true,
          data: payment,
          message: 'Payment status updated successfully!',
          status: 'success',
        })
      } else {
        handleErrorWithStatus(res, 200, 'No payment found!', { status: 'info' })
      }
    } else {
      handleErrorWithStatus(res, 200, 'No payment found!', { status: 'error' })
    }
  } catch (err) {
    handleError(res, 'Something wents wrong. Try again later!')
  }
}

// create new user
exports.CreateNewUser = async (req, res) => {
  try {
    const { username, password, usertype } = req.body
    if (!username || !password || !usertype) {
      return handleErrorWithStatus(res, 200, 'All fields are required!')
    }
    // if (password.length < 8) {
    //   return handleErrorWithStatus(res, 200, 'Pa required!')
    // }
    const user = await User.findOne({ username })
    if (user) {
      return handleErrorWithStatus(res, 200, 'Username is already exist!')
    } else {
      const user = await User.create({
        username,
        password,
        role: usertype,
      })
      user.save(async (err, user) => {
        if (err) handleError(res, err)
        else {
          res.status(201).json({
            success: true,
            status: 'success',
            data: user,
            message: 'User created succcessfully!',
          })
        }
      })
    }
  } catch (err) {
    console.log(err)
    if (strictValidObjectWithKeys(generateValidationsErrors(err))) {
      handleError(res, generateValidationsErrors(err).requiredFields[0].message)
    } else {
      handleErrorWithStatus(res, 404, 'Something wents wrong. Try again later!')
    }
  }
}

// delete User
exports.DeleteUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId)
    if (strictValidObjectWithKeys(user)) {
      console.log(user)
      user = await User.findByIdAndDelete(req.params.userId)
      res.status(200).json({
        success: true,
        status: 'success',
        message: 'User Deleted Successfully!',
      })
    } else {
      res.status(200).json({
        success: false,
        status: 'info',
        message: 'User not found!',
      })
    }
  } catch (err) {
    handleError(res, 'Something wents wrong. Try again later!', {
      status: 'error',
    })
  }
}
