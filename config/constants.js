const { defaultAttributes } = require('../config/model');
const EXPRESS = require('express');
const VALIDATOR = require('validatorjs');
const UUID = require('uuid');
const BCRYPT = require('bcrypt');
const JWT = require('jsonwebtoken');
const FS = require('fs');
const NODEMAILER = require('nodemailer');

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
  VerifyUserEmail: 'verifyUserEmail',
  SignInUserEmail: 'signInUserEmail',
};

// Roles of the user
const USER_ROLES = {
  Scribe: 'scribe',
  Student: 'student',
};

// JWT Types
const JWT_TYPE = {
  VerifyEmail: 'verifyEmail',
  LoginUser: 'loginUser',
};

// JWT Expires
const JWT_EXPIRY = {
  Access: '24h',
  Refresh: '2d',
};

// Email Events
const EMAIL_EVENTS = {
  VerifyUser: 'verifyUser',
  LoginUser: 'loginUser',
};

// Export the constants
module.exports.constants = {
  defaultAttributes,
  EXPRESS,
  VALIDATOR,
  RESPONSE_CODES,
  FS,
  VALIDATION_EVENTS,
  USER_ROLES,
  UUID,
  BCRYPT,
  SALT_ROUNDS,
  JWT,
  JWT_TYPE,
  JWT_EXPIRY,
  NODEMAILER,
  EMAIL_EVENTS,
};
