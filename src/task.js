import cron from 'cron';
import record from './record';
import social from './social';

const CronJob = cron.CronJob;

export default function task() {
  const recordJob = new CronJob('58 12 * * 4', () => {
    console.log('Recorder Running');

    record(() => {
      console.log('Recorder Finished');
    });
  });

  const dailySocialJob = new CronJob('0 11 * * *', () => {
    console.log('Checking Daily Social Stats');

    social.checkFeed((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Checked Feed');
      }
    });

    social.checkLikes((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Checked Likes');
      }
    });
  });

  const weeklySocialJob = new CronJob('0 11 7 * 1', () => {
    console.log('Checking Weekly Social Stats');

    social.checkEngagement((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Checked Engagement');
      }
    });
  });

  recordJob.start();
  dailySocialJob.start();
  weeklySocialJob.start();
}
