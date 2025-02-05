const { keepServiceAwake } = require('../api/helpers/keepServiceAwake');

module.exports = {
  jobs: {
    keepServiceAwake: {
      schedule: '*/10 * * * *',
      start: process.env.CRON_RUNNING === 'Y',
      onTick: async () => {
        try {
          await keepServiceAwake();
        } catch (error) {
          console.error('Error in keepServiceAwake:', error);
        }
      },
    },
  },
};
