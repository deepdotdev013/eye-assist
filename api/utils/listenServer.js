const { sequelize } = require('../../config/sequelize');

const startServer = async (server, sequelize, port) => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully..✅');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { startServer };
