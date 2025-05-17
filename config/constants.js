const { defaultAttributes } = require('../config/model');
const EXPRESS = require('express');
const VALIDATOR = require('validatorjs');
const UUID = require('uuid');
const BCRYPT = require('bcrypt');
const JWT = require('jsonwebtoken');
const FS = require('fs');
const NODEMAILER = require('nodemailer');
const AXIOS = require('axios');
const MULTER = require('multer');
const { createClient } = require('@supabase/supabase-js');

// Salt rounds for bcrypt
const SALT_ROUNDS = 10;

// Name of the supabase bucket for media upload.
const BUCKET_NAME = 'media';

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
  OnBoardUser: 'onBoardUser',
  CreateQualificationStream: 'createQualificationStream',
  GetAllStreams: 'getAllStreams',
  UploadMedia: 'uploadMedia',
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

// Allowed files types for upload
const ALLOWED_FILE_TYPES = {
  Jpg: 'jpg',
  Jpeg: 'jpeg',
  Png: 'png',
  Mov: 'mov',
  Mp4: 'mp4',
  Mp3: 'mp3',
};

// Types of files allowed
const FILE_TYPES = {
  Image: 'image',
  Video: 'video',
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
  AXIOS,
  MULTER,
  ALLOWED_FILE_TYPES,
  createClient,
  BUCKET_NAME,
  FILE_TYPES,
};
