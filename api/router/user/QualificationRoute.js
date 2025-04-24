// Import express
const { EXPRESS } = require('../../../config/constants').constants;

// Create the router
const ROUTER = EXPRESS.Router();

// Import the policy
const { CheckUserAuth } = require('../../policies/CheckUserAuth');

// Import the controller
const QualificationController = require('../../controllers/user/QualificationController');

// Import the redis cache policy
const cache = require('../../policies/redisCache');

// Route to cache
const cacheRoutes = {
  'GET:/all-qualifications': { ttl: 300 },
  'GET:/all-streams': { ttl: 300 },
};

// Apply the policy to the router
ROUTER.use(cache(cacheRoutes));

ROUTER.post('/create', QualificationController.createQualificationStream)
  .get(
    '/all-qualifications',
    QualificationController.getAllHighestQualification,
  )
  .get('/all-streams', QualificationController.getAllStreams);

module.exports = ROUTER;
