const mongoose = require('mongoose')

const paySchema = new mongoose.Schema(
  {
    paymentmethod: {
      type: String,
      required: [true, 'Please Select Payment Methos!'],
      enum: ['BTC'],
    },
    payment_type: {
      type: String,
      required: [true, 'Please Select Amount To Pay!'],
    },
    btcaddress: {
      type: String,
      required: [true, 'Please Type BTC address To Pay!'],
    },
    amount: {
      type: Number,
      //   required: [true, 'Please Type Amount To Pay!'],
    },
    status: {
      type: String,
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Pay', paySchema)
