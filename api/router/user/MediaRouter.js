// Import express
const { EXPRESS } = require('../../../config/constants').constants;

// Create the router
const ROUTER = EXPRESS.Router();

// Import the policy
const { CheckUserAuth } = require('../../policies/CheckUserAuth');
const { UploadMedia } = require('../../policies/UploadMedia');

// Import the controller
const MediaController = require('../../controllers/user/MediaController');

ROUTER.post(
  '/upload-single',
  [UploadMedia, CheckUserAuth],
  MediaController.uploadSingleMedia,
);

module.exports = ROUTER;
