const expressRouter = require('express').Router;
const adminController = require('../controllers/admin-controller');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const adminRouter = expressRouter();

adminRouter.use(isAuthenticatedUser)
adminRouter.use(authorizeRoles('admin'))

// GET: all users route only for 'admin'
adminRouter.route('/users').get(adminController.GetUsers);

// POST: req for Create New User
adminRouter.route('/create-user').post(isAuthenticatedUser, adminController.CreateNewUser);

module.exports = adminRouter;
