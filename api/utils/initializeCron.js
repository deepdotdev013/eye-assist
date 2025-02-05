const cron = require('node-cron');
const cronConfig = require('../../config/cron');

// Configure running the cron jobs.
const initializeCronJobs = () => {
  for (const jobName in cronConfig.jobs) {
    const job = cronConfig.jobs[jobName];

    if (job.start) {
      try {
        // Attempt to schedule the job
        const task = cron.schedule(job.schedule, job.onTick);

        // Logging for acknowledgement.
        console.log(`Cron job '${jobName}' scheduled successfully.`);
      } catch (error) {
        console.error(`Error scheduling cron job '${jobName}':`, error);
      }
    } else {
      // Use a more informative log level (like debug or info)
      console.info(
        `Cron job '${jobName}' is disabled (Likely due to 'start' being false).`,
      );
    }
  }
};

module.exports = { initializeCronJobs };
