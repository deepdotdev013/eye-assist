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
const { User, sequelize } = require('../../models');
const { generateToken, verifyToken } = require('../../utils/tokenUtils');
const { sendMail } = require('../../helpers/sendMail');
const { checkUpdatedData } = require('../../helpers/checkUpdatedData');

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
        type: JWT_TYPE.VerifyEmail,
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

  /**
   * @name verifyUserEmail
   * @path /user/verify-email
   * @method POST
   * @schema User
   * @param {string} - req.body.token - Token of the created user
   * @description This method is used to verify a user's email using key token.
   * @returns {Object} JSON object containing the user data
   * @author Deep Panchal
   */
  verifyUserEmail: async (req, res) => {
    try {
      // Create the bodyData
      const bodyData = {
        token: req.body.token,
        eventCode: VALIDATION_EVENTS.VerifyUserEmail,
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

      // Find the user with the incoming token in its verificationToken.
      const user = await User.findOne({
        where: {
          verificationToken: bodyData.token,
          isDeleted: false,
        },
      });
      if (!user) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('USER_NOT_FOUND'),
          error: error,
        });
      }

      // Verify the token
      const verifiedToken = await verifyToken(
        bodyData.token,
        JWT_TYPE.VerifyEmail,
      ).catch((error) => {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('INVALID_TOKEN'),
          error: error,
        });
      });

      // Check if the user's email is already verified.
      if (verifiedToken?.data?.isEmailVerified) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('EMAIL_ALREADY_VERIFIED'),
          data: null,
        });
      }

      // Verify the user's email.
      await User.update(
        {
          isEmailVerified: true,
          verificationToken: null,
          updatedAt: Date.now(),
          updatedBy: user.id,
        },
        {
          where: {
            id: verifiedToken.data.id,
            isDeleted: false,
          },
        },
      );

      // Success Response
      return res.status(RESPONSE_CODES.Ok).json({
        status: RESPONSE_CODES.Ok,
        message: req.__('EMAIL_VERIFY_SUCCESS'),
        data: null,
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

  /**
   * @name signInUserEmail
   * @path /user/signin-email
   * @method POST
   * @schema User
   * @param {string} - req.body.email - Email of the user
   * @param {string} - req.body.password - Password of the user
   * @description This method is used to sign-in a user.
   * @returns {Object} JSON object containing the user data
   * @author Deep Panchal
   */
  signInUserEmail: async (req, res) => {
    try {
      // Create the bodyData
      const bodyData = {
        email: req.body.email && req.body.email.trim().toLowerCase(),
        password: req.body.password,
        eventCode: VALIDATION_EVENTS.SignInUserEmail,
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

      // Check if the user exists.
      const isExistingUser = await User.findOne({
        where: {
          email: bodyData.email,
          isDeleted: false,
        },
      });
      if (!isExistingUser) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('USER_NOT_FOUND'),
          data: null,
        });
      }

      // Check if the email is not verified.
      if (!isExistingUser.isEmailVerified) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('EMAIL_NOT_VERIFIED'),
          data: null,
        });
      }

      // Match the incoming password with the user's saved password.
      const isPasswordMatch = await BCRYPT.compare(
        bodyData.password,
        isExistingUser.password,
      );

      // If the password didn't matched, send error.
      if (!isPasswordMatch) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('INCORRECT_CREDS'),
          data: null,
        });
      }

      // Generate the JWT Token
      const token = await generateToken({
        id: bodyData.id,
        email: bodyData.email,
        type: JWT_TYPE.LoginUser,
      });

      // If any error occurs while generating the token, then send an error
      if (token.hasError) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('TOKEN_GENERATION_ERROR'),
          error: token.error,
        });
      }

      // Update the user.
      await User.update(
        {
          token: token.data,
          updatedAt: Date.now(),
          updatedBy: isExistingUser.id,
        },
        {
          where: {
            id: isExistingUser.id,
          },
        },
      );

      // Success Response
      return res.status(RESPONSE_CODES.Ok).json({
        status: RESPONSE_CODES.Ok,
        message: req.__('LOGIN_SUCCESS'),
        data: {
          id: isExistingUser.id,
          email: isExistingUser.email,
          username: isExistingUser.username,
          token: token.data,
          stepComplete: isExistingUser.stepComplete,
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

  /**
   * @name getUserDetails
   * @path /user/get-user-details
   * @method GET
   * @schema User
   * @description This method is used to fetch all the details of logged in user.
   * @returns {Object} JSON object containing the user data
   * @author Deep Panchal
   */
  getUserDetails: async (req, res) => {
    try {
      // Query to fetch users details.
      const fetchUserDetails = `SELECT
        	U."id",
        	U."profilePhotoId",
        	U."username",
        	U."firstName",
        	U."lastName",
        	U."email",
        	U."role",
        	U."dob",
        	U."country",
        	U."age",
        	U."gender",
        	U."mobileNumber",
        	U."token",
        	U."isEmailVerified",
          U."highestQualificationId",
          U."streamId",
          U."otherQualification",
          U."otherStream",
          U."preferredLanguage",
          U."aboutMe",
          CASE WHEN U."certificateId" IS NULL AND M."mediaUrl" IS NULL THEN NULL
            ELSE JSONB_BUILD_OBJECT(
                  'id', U."certificateId",
                  'mediaUrl', M."mediaUrl"
          ) END AS "certificateData",
        	U."stepComplete"
        FROM
        	"user" U LEFT JOIN "media" M ON U."certificateId" = M."id" AND M."isDeleted" = FALSE
        WHERE
        	U."isDeleted" = FALSE
        	AND U."id" = :userId`;

      // Run the sql query using sequelize query.
      const getUserDetails = await sequelize.query(fetchUserDetails, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          userId: req.user.id,
        },
      });

      // Success Response
      return res.status(RESPONSE_CODES.Ok).json({
        status: RESPONSE_CODES.Ok,
        message: null,
        data: getUserDetails?.[0] || {},
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

  /**
   * @name preventServerAsleep
   * @path /user/prevent-asleep
   * @method GET
   * @schema User
   * @description This method is used to keep the server awake and prevent from asleep.
   * @returns {Object} JSON object containing the user data
   * @author Deep Panchal
   */
  preventServerAsleep: async (req, res) => {
    try {
      // Ping the database to fetch the requested record.
      const user = await User.findAll({
        where: {
          isDeleted: false,
        },
        limit: 1,
        attributes: ['role'],
      });

      console.log('USER ==> ', user?.[0].dataValues.role);

      return res.status(RESPONSE_CODES.Ok).json({
        status: RESPONSE_CODES.Ok,
        message: req.__('SERVER_AWAKE'),
        data: user?.[0].dataValues.role,
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

  /**
   * @name onBoardUser
   * @path /user/onboard-user
   * @method POST
   * @schema User
   * @param {boolean} - req.body.isPageSkipped - Flag to check if user skipped the page
   * @param {number} - req.body.stepComplete - Number of step user completed
   * @param {date} - req.body.dob - Date of birth of the user
   * @param {number} - req.body.age - Age of the user
   * @param {string} - req.body.gender - Gender of the user
   * @param {string} - req.body.country - Country of the user
   * @param {string} - req.body.mobileNumber - Mobile number of the user
   * @description This method is used to add the user details step wise.
   * @returns {Object} JSON object containing the user data
   * @author Deep Panchal
   */
  onBoardUser: async (req, res) => {
    try {
      // Create the bodyData
      const bodyData = {
        userId: req.user.id,
        // Mandatory fields
        isPageSkipped: req.body.isPageSkipped,
        stepComplete: req.body.stepComplete,

        // Step #1 Data
        dob: req.body.dob,
        age: req.body.age,
        gender: req.body.gender,
        country: req.body.country,
        mobileNumber: req.body.mobileNumber,

        // Step #2 Data
        highestQualificationId: req.body.highestQualificationId,
        streamId: req.body.streamId,
        otherQualification: req.body.otherQualification,
        otherStream: req.body.otherStream,
        preferredLanguage: req.body.preferredLanguage,
        aboutMe: req.body.aboutMe,

        // Step #3 Data
        certificateId: req.body.certificateId,

        eventCode: VALIDATION_EVENTS.OnBoardUser,
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

      // Check if the user is an existing user.
      const existingUser = await User.findOne({
        where: { id: bodyData.userId, isDeleted: false },
      });
      if (!existingUser) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('USER_NOT_FOUND'),
          data: null,
        });
      }

      // Get the updated data only.
      const updatedData = await checkUpdatedData(bodyData);

      // Ensure stepComplete doesn't decrease
      if (bodyData.stepComplete < existingUser.stepComplete) {
        delete updatedData.stepComplete;
      }

      // Check if the page is skipped.
      if (bodyData.isPageSkipped) {
        // Only update the stepComplete.
        await User.update(
          {
            stepComplete: bodyData.stepComplete,
            updatedAt: Date.now(),
            updatedBy: bodyData.userId,
          },
          {
            where: {
              id: bodyData.userId,
              isDeleted: false,
            },
          },
        );
      } else {
        // If the user clicks on continue, then save the data.
        await User.update(updatedData, {
          where: {
            id: bodyData.userId,
            isDeleted: false,
          },
        });
      }

      // Success Response
      return res.status(RESPONSE_CODES.Ok).json({
        status: RESPONSE_CODES.Ok,
        message: req.__('STEP_COMPLETE_SUCCESS'),
        data: null,
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
