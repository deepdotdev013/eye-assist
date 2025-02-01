const { User } = require('../models');

const { JWT, JWT_TYPE, JWT_EXPIRY } =
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
    const decodedTokenData = await JWT.verify(token, process.env.JWT_SECRET);

    if (decodedTokenData.exp < Date.now() / 1000) {
      return {
        hasError: true,
        message: 'Token Expired',
        error: 'Token Expired',
        data: null,
      };
    }

    let where = { token };
    if (decodedTokenData.type === JWT_TYPE.VERIFY_EMAIL) {
      where.id = decodedTokenData.id;
      where.email = decodedTokenData.email;
    }

    let user = await User.findOne({ where });

    user = user && user.get({ plain: true });

    if (!user) {
      return {
        hasError: true,
        message: 'User Not Found',
        error: 'User Not Found',
        data: null,
      };
    }

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
