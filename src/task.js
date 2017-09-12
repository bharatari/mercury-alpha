import cron from 'cron';
import record from './record';
import social from './social';
import config from './config';

const CronJob = cron.CronJob;

export function recordTask(crontab) {
  const job = new CronJob(crontab, () => {
    console.log('Recorder Running');

    record(() => {
      console.log('Recorder Finished');
    });
  });

  job.start();
}

export function dailySocialTask() {
  const job = new CronJob('0 11 * * *', () => {
    social.dailySocial();
  });

  job.start();
}

export function weeklySocialTask() {
  const job = new CronJob('0 11 7 * 1', () => {
    social.weeklySocial();
  });

  job.start();
}
