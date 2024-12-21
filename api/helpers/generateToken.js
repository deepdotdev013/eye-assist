const { JWT } = require('../../config/constants').constants;

// Generate a token
const generateToken = async (tokenData) => {
  try {
    const token = await JWT.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return {
      hasError: false,
      data: token,
    };
  } catch (error) {
    console.log('generateToken error: ', error);
    return {
      hasError: true,
      errors: error,
    };
  }
};

module.exports = { generateToken };
