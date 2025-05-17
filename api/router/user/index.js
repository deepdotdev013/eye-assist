const { EXPRESS } = require('../../../config/constants').constants;
const ROUTER = EXPRESS.Router();

// Importing routes
const AuthRoute = require('./AuthRoute');
const QualificationRoute = require('./QualificationRoute');
const MediaRouter = require('./MediaRouter');

// Mounting prefixes routes
ROUTER.use('/', AuthRoute);
ROUTER.use('/qualification', QualificationRoute);
ROUTER.use('/media', MediaRouter);

module.exports = ROUTER;
