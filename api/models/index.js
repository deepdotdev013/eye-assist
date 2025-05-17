const { sequelize } = require('../../config/sequelize');
const User = require('./User');
const HighestQualificationStream = require('./HighestQualificationStream');
const Media = require('./Media');

module.exports = {
  sequelize,
  User,
  HighestQualificationStream,
  Media,
};
