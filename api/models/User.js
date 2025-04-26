/**
 * User.js
 * @description :: A model definition. Represents a user in the system.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize');
const { defaultAttributes } = require('../../config/constants').constants;
const { HighestQualificationStream } = require('./index');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    ...defaultAttributes,
    profilePhotoId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'media',
        key: 'id',
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stepComplete: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    highestQualificationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: HighestQualificationStream,
        key: 'id',
      },
    },
    streamId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: HighestQualificationStream,
        key: 'id',
      },
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aboutMe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otherQualification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otherStream: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'user',
    timestamps: false,
  },
);

module.exports = User;
