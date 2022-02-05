const expressRouter = require('express').Router
const payController = require('../controllers/pay-controller')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

const payRouter = expressRouter()

payRouter.use(isAuthenticatedUser)
// payRouter.use(authorizeRoles('admin'))

// POST/GET: req for Create New Payment
payRouter.route('/').post(payController.Pay).get(payController.GetPayments)

module.exports = payRouter
