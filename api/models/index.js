const { sequelize } = require('../../config/sequelize');
const User = require('./User');
const HighestQualificationStream = require('./HighestQualificationStream');

module.exports = {
  sequelize,
  User,
  HighestQualificationStream,
};
