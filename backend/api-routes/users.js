const expressRouter = require('express').Router
const userController = require('../controllers/user-controller')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

const userRouter = expressRouter()

// POST: req for Change Password
userRouter
  .route('/update-password')
  .post(isAuthenticatedUser, userController.UpdatePassword)

// POST: req for login
userRouter.route('/login').post(userController.UserLogin)

// GET: req for logout user
userRouter.route('/logout').get(userController.logoutUser)

module.exports = userRouter
