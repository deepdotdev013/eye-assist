const { Sequelize } = require("sequelize");
const { adapter, url } = require("./datastores");

module.exports.sequelize = new Sequelize(url, {
  dialect: adapter,
});
