// Import User Model
const Pay = require('../models/pay-model')
const {
  handleError,
  handleErrorWithStatus,
  strictValidArrayWithMinLength,
  generateValidationsErrors,
  strictValidObjectWithKeys,
} = require('../helper/utils')

// Handle get payments actions
exports.GetPayments = async (req, res) => {
  try {
    const payments = await Pay.find({ user: req.user._id })
    // console.log('payments', payments)
    if (strictValidArrayWithMinLength(payments, 1)) {
      res.status(200).json({
        success: true,
        data: payments,
      })
    } else {
      handleErrorWithStatus(res, 200, 'No payment found!', {}, 'info')
    }
  } catch (err) {
    console.log(err)
    handleError(res, 'Something wents wrong. Try again later!')
  }
}

//Handle post payment reqs
exports.Pay = async (req, res) => {
  try {
    const { amount, btcaddress, payment_type, paymentmethod } = req.body
    let isCustomAmount = payment_type === 'custom'
    if (
      !btcaddress ||
      !payment_type ||
      !paymentmethod ||
      (isCustomAmount && !amount)
    ) {
      return handleErrorWithStatus(
        res,
        200,
        'All fields are required!',
        {},
        'error'
      )
    }
    // const isBtcAddressExist = await Pay.findOne({ btcaddress })
    // if (isBtcAddressExist) {
    //   return handleErrorWithStatus(res, 200, 'BTC address is already taken!')
    // } else
    let customAmount = isCustomAmount ? { amount } : {}
    const payment = await Pay.create({
      btcaddress,
      payment_type,
      paymentmethod,
      ...customAmount,
      user: req.user,
    })
    payment.save(async (err, payment) => {
      if (err) handleError(res, err)
      else {
        res.status(201).json({
          success: true,
          status: 'success',
          data: payment,
          message: 'payment created succcessfully!',
        })
      }
    })
  } catch (err) {
    if (strictValidObjectWithKeys(generateValidationsErrors(err))) {
      handleError(res, 'Invalid request!', generateValidationsErrors(err))
    } else {
      handleErrorWithStatus(
        res,
        404,
        'Something wents wrong. Try again later!',
        {},
        'error'
      )
    }
  }
}
