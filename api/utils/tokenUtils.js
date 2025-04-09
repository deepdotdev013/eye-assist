const { User } = require('../models');
const { JWT, JWT_EXPIRY, JWT_TYPE } =
  require('../../config/constants').constants;

// Generate a token
const generateToken = async (tokenData) => {
  try {
    // Sign the refreshToken
    const refreshToken = await JWT.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRY.Access,
    });

    // Send the succes response along with the token
    return {
      hasError: false,
      error: null,
      data: refreshToken,
    };
  } catch (error) {
    console.log('generateToken error: ', error);
    // Send the error when catch fires.
    return {
      hasError: true,
      error: error,
      data: null,
    };
  }
};

// Verify a token
const verifyToken = async (token, type) => {
  try {
    // Verify the token using jwt secret.
    const decodedTokenData = await JWT.verify(token, process.env.JWT_SECRET);

    // Checks if the token has expired or not.
    if (decodedTokenData.exp < Date.now() / 1000) {
      return {
        hasError: true,
        message: 'Token Expired',
        error: 'Token Expired',
        data: null,
      };
    }

    // Create a dynamic where condition.
    let where = {};

    // Check the JWT type with the incoming type
    if (type === JWT_TYPE.VerifyEmail) {
      where.verificationToken = token;
    } else if (type === JWT_TYPE.LoginUser) {
      where.token = token;
    }

    // Find the user with the where condition.
    let user = await User.findOne({ where });

    // Get the user data.
    user = user && user.get({ plain: true });

    // Check if the user is present or not.
    if (!user) {
      return {
        hasError: true,
        message: 'User Not Found',
        error: 'User Not Found',
        data: null,
      };
    }

    // Success Response.
    return {
      hasError: false,
      message: 'Token Verified Successfully',
      error: null,
      data: user,
    };
  } catch (error) {
    return {
      hasError: true,
      error: error,
      data: null,
    };
  }
};

module.exports = { generateToken, verifyToken };
