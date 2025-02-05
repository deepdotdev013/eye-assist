const { sequelize } = require('../../config/sequelize');
const { initializeCronJobs } = require('./initializeCron');

const startServer = async (server, sequelize, port) => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully..✅');

    // Initialize the Cron Jobs
    initializeCronJobs();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { startServer };
