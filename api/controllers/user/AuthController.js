const {
  RESPONSE_CODES,
  VALIDATION_EVENTS,
  BCRYPT,
  SALT_ROUNDS,
  UUID,
  JWT_TYPE,
  EMAIL_EVENTS,
} = require('../../../config/constants').constants;
const { validateUserData } = require('../../validations/UserValidation');
const { User } = require('../../models');
const { generateToken } = require('../../utils/tokenUtils');
const { sendMail } = require('../../helpers/sendMail');

module.exports = {
  /**
   * @name signUpUserEmail
   * @path /user/signup-email
   * @method POST
   * @schema User
   * @param {string} - req.body.email - Email of the user
   * @param {string} - req.body.password - Password of the user
   * @param {string} - req.body.confirmPassword - To confirm the entered password
   * @param {string} - req.body.username - Username of the user
   * @param {string} - req.body.firstName - FirstName of the user
   * @param {string} - req.body.lastName - LastName of the user
   * @param {string} - req.body.role - Role of the user
   * @description This method is used to sign up a user using email.
   * @returns {Object} JSON object containing the user data
   * @author Deep Panchal
   */
  signUpUserEmail: async (req, res) => {
    try {
      // Create the bodyData
      const bodyData = {
        id: UUID.v4(),
        email: req.body.email && req.body.email.toLowerCase().trim(),
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username && req.body.username.toLowerCase().trim(),
        firstName: req.body.firstName && req.body.firstName.trim(),
        lastName: req.body.lastName && req.body.lastName.trim(),
        role: req.body.role && req.body.role.toLowerCase(),
        eventCode: VALIDATION_EVENTS.SignUpUserEmail,
      };

      // Validate the incoming data
      const result = validateUserData(bodyData);

      // If the validation fails, send an error
      if (result.hasError) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('VALIDATION_ERROR'),
          error: result.errors,
        });
      }

      // Check if the email is already registered
      const isExistingEmail = await User.findOne({
        where: {
          email: bodyData.email,
          isDeleted: false,
        },
      });
      if (isExistingEmail) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('EMAIL_ALREADY_REGISTERED'),
          data: null,
        });
      }

      // Check if the username already exists
      const isExistingUsername = await User.findOne({
        where: {
          username: bodyData.username,
          isDeleted: false,
        },
      });
      if (isExistingUsername) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('USERNAME_ALREADY_EXISTS'),
          data: null,
        });
      }

      // Compare the password and confirm password
      if (bodyData.password !== bodyData.confirmPassword) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('PASSWORD_MISMATCH'),
          data: null,
        });
      }

      // Hash the password using bcrypt
      const hashedPassword = await BCRYPT.hash(bodyData.password, SALT_ROUNDS);

      // Generate the JWT Token
      const generateVerificationToken = await generateToken({
        id: bodyData.id,
        email: bodyData.email,
        type: JWT_TYPE.VERIFY_EMAIL,
      });

      // If any error occurs while generating the token, then send an error
      if (generateVerificationToken.hasError) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('TOKEN_GENERATION_ERROR'),
          error: generateVerificationToken.error,
        });
      }

      // Append the updated fields in the bodyData
      bodyData.password = hashedPassword;
      bodyData.verificationToken = generateVerificationToken.data;

      // Create a new user
      const newUser = await User.create(bodyData);

      // Create the input params.
      const inputs = {
        subType: EMAIL_EVENTS.VerifyUser,
        payload: {
          lang: 'en',
          name: newUser.firstName,
          toUser: newUser.email,
          MailSubject: req.__('VERIFY_EMAIL_TITLE'),
          link: `${process.env.FRONTEND_URL}/verify-email?token=${generateVerificationToken.data}`,
          supportEmail: process.env.SMTP_SENDER,
          websiteLink: process.env.WEBSITE_URL || 'www.google.com',
        },
      };

      // Send the email
      await sendMail(inputs);

      // Success Response
      return res.status(RESPONSE_CODES.Created).json({
        status: RESPONSE_CODES.Created,
        message: req.__('USER_SIGNUP_SUCCESS'),
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.log('error: ', error);
      return res.status(RESPONSE_CODES.ServerError).json({
        status: RESPONSE_CODES.ServerError,
        message: req.__('WENTS_WRONG'),
        data: null,
      });
    }
  },
};
