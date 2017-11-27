import IConfig from '../../interfaces/IConfig';

export default class RecordConfig implements IConfig {
  task: boolean;
  now: boolean;
  crontab: Array<string>;

  constructor(task: boolean, now: boolean, crontab: Array<string>) {
    this.task = task;
    this.now = now;
    this.crontab = crontab;
  }
}
