/**
 * HighestQualificationStream.js
 * @description :: A model definition. Represents a user in the system.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize');
const { defaultAttributes } = require('../../config/constants').constants;

const HighestQualificationStream = sequelize.define(
  'HighestQualificationStream',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    ...defaultAttributes,
    qualification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      unique: true,
    },
    stream: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parentQualificationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'HighestQualificationStream',
        key: 'id',
      },
    },
    other: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eligibleForStudent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'highest_qualification_stream',
    timestamps: false,
  },
);

module.exports = HighestQualificationStream;
