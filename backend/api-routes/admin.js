const expressRouter = require('express').Router
const adminController = require('../controllers/admin-controller')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

const adminRouter = expressRouter()

adminRouter.use(isAuthenticatedUser)
adminRouter.use(authorizeRoles('admin'))

// GET: all users route only for 'admin'
adminRouter.route('/all-users').get(adminController.GetUsers)

// GET: all payments route only for 'admin'
adminRouter.route('/all-payments').get(adminController.GetPayments)

// GET: update payment status route only for 'admin'
adminRouter
  .route('/update-payment-status')
  .put(adminController.UpdatePaymentStatus)

// POST: req for Create New User
adminRouter.route('/create-user').post(adminController.CreateNewUser)

adminRouter.route('/:userId').delete(adminController.DeleteUser)

module.exports = adminRouter
