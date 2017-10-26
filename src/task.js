import cron from 'cron';
import record from './record';
import social from './social';
import config from './config';
import _ from 'lodash';

const CronJob = cron.CronJob;

export function recordTask(crontab) {
  if (crontab) {
    if (_.isArray(crontab)) {
      for (let i = 0; i < crontab.length; i++) {
        const job = new CronJob(crontab[i], () => {
          console.log('Recorder Running');

          record(() => {
            console.log('Recorder Finished');
          });
        });

        job.start();
      }
    } else {
      throw new Error('Crontab must be an array of valid cron tabs.')
    }
  } else {
    throw new Error('Crontab must be an array of valid cron tabs.')
  }  
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
