// Import express
const { EXPRESS } = require('../../../config/constants').constants;

// Create the router
const ROUTER = EXPRESS.Router();

// Import the policy
const { CheckUserAuth } = require('../../policies/CheckUserAuth');

// Import the controller
const AuthController = require('../../controllers/user/AuthController');

// Import the redis cache policy
const cache = require('../../policies/redisCache');

// Route to cache
const cacheRoutes = {
  'GET:/get-user-details': { ttl: 300 },
};

// Apply the policy to the router
ROUTER.use(cache(cacheRoutes));

ROUTER.post('/signup-email', AuthController.signUpUserEmail)
  .post('/verify-email', AuthController.verifyUserEmail)
  .post('/signin-email', AuthController.signInUserEmail)
  .get('/get-user-details', [CheckUserAuth], AuthController.getUserDetails)
  .get('/prevent-asleep', AuthController.preventServerAsleep)
  .post('/onboard-user', [CheckUserAuth], AuthController.onBoardUser);

module.exports = ROUTER;
