import * as cron from 'cron';
import * as _ from 'lodash';

import IRunner from '../interfaces/IRunner';
import IConfig from '../interfaces/IConfig';

export default class Runner<T extends IRunner> {
  config: IConfig;
  feature: T;

  constructor(config: IConfig, feature: T) {
    this.config = config;
    this.feature = feature;
  }

  async start() {
    await this.runNow();
    await this.runTask();
  }

  async runTask() {
    const { task, crontab } = this.config;

    if (task) {
      if (crontab) {
        if (_.isArray(crontab)) {
          for (let i = 0; i < crontab.length; i++) {
            const job = new cron.CronJob(crontab[i], async () => {
              await this.feature.run();
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
  }

  async runNow() {
    if (this.config.now) {
      await this.feature.run();
    }
  }
}
