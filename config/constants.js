const { defaultAttributes } = require('../api/utils/defaultAttributes');
const EXPRESS = require('express');
const VALIDATOR = require('validatorjs');
const UUID = require('uuid');
const BCRYPT = require('bcrypt');
const JWT = require('jsonwebtoken');

const SALT_ROUNDS = 10;
// Response Codes
const RESPONSE_CODES = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  ServerError: 500,
};

// Validation Events
const VALIDATION_EVENTS = {
  SignUpUserEmail: 'signUpUserEmail',
};

// Roles of the user
const USER_ROLES = {
  Scribe: 'scribe',
  Student: 'student',
};

// JWT Types
const JWT_TYPE = {
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  RESET_PASSWORD: 'RESET_PASSWORD',
};

// Export the constants
module.exports.constants = {
  defaultAttributes,
  EXPRESS,
  VALIDATOR,
  RESPONSE_CODES,
  VALIDATION_EVENTS,
  USER_ROLES,
  UUID,
  BCRYPT,
  SALT_ROUNDS,
  JWT,
  JWT_TYPE,
};
