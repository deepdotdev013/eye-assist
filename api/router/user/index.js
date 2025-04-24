const { EXPRESS } = require('../../../config/constants').constants;
const ROUTER = EXPRESS.Router();

// Importing routes
const AuthRoute = require('./AuthRoute');
const QualificationRoute = require('./QualificationRoute');

// Mounting prefixes routes
ROUTER.use('/', AuthRoute);
ROUTER.use('/qualification', QualificationRoute);

module.exports = ROUTER;
