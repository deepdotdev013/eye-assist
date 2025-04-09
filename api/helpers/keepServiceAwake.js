const { AXIOS } = require('../../config/constants').constants;

const URL = process.env.BACKEND_URL;

const INTERVAL = 1800000; // 3 minutes in milliseconds

const keepServiceAwake = async () => {
  try {
    AXIOS.get(`${URL}/api/user/prevent-asleep`)
      .then((response) => {
        console.log(
          `Reloaded at ${Date.now()}: Status Code ${response.status}`,
        );
      })
      .catch((error) => {
        console.error(`Error reloading at ${Date.now()}:`, error.message);
      });
  } catch (error) {
    console.log('Error in keepServiceAwake helper --> ', error);
  }
};

const startPinging = () => {
  // Make the first ping immediately
  keepServiceAwake();

  // Set the interval to ping every 5 minutes (300000 ms)
  setInterval(keepServiceAwake, INTERVAL);
};

module.exports = { keepServiceAwake, startPinging };
