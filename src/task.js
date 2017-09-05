import cron from 'cron';
import record from './record';
import social from './social';

const CronJob = cron.CronJob;

export function recordTask() {
  const job = new CronJob('57 12 * * 4', () => {
    console.log('Recorder Running');

    record(() => {
      console.log('Recorder Finished');
    });
  });

  job.start();
}

export function dailySocialTask() {
  export const job = new CronJob('0 11 * * *', () => {
    social.dailySocial();
  });

  job.start();
}

export function weeklySocialTask() {
  export const job = new CronJob('0 11 7 * 1', () => {
    social.weeklySocial();
  });

  job.start();
}
