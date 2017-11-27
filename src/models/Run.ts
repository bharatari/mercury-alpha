import Config from './Config';
import Record from '../features/record/Record';
import WeeklySocial from '../features/social/WeeklySocial';
import DailySocial from '../features/social/DailySocial';
import Runner from './Runner';

export default class Run {
  dailySocialRunner: Runner<DailySocial>;
  weeklySocialRunner: Runner<WeeklySocial>;
  recordRunner: Runner<Record>;

  async start() {
    const config = await Config.load('config.json');

    console.log(`Running Mercury Ion v${process.env.npm_package_version}`);

    const dailySocial = new DailySocial();
    this.dailySocialRunner = new Runner<DailySocial>(config.dailySocial, dailySocial);
    await this.dailySocialRunner.start();

    const weeklySocial = new WeeklySocial();
    this.weeklySocialRunner = new Runner<WeeklySocial>(config.weeklySocial, dailySocial);
    await this.weeklySocialRunner.start();

    const record = new Record();
    this.recordRunner = new Runner<Record>(config.record, record);
    await this.recordRunner.start();
  }
}
