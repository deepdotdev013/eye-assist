// Import express
const { EXPRESS } = require('../../../config/constants').constants;

// Create the router
const ROUTER = EXPRESS.Router();

// Import the controller
const AuthController = require('../../controllers/user/AuthController');

ROUTER.post('/signup-email', AuthController.signUpUserEmail).post(
  '/verify-email',
  AuthController.verifyUserEmail,
);

module.exports = ROUTER;
