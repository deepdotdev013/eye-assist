const { User } = require('../models');

const keepServiceAwake = async () => {
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
  } catch (error) {
    console.log('Error in keepServiceAwake helper --> ', error);
  }
};

module.exports = { keepServiceAwake };
