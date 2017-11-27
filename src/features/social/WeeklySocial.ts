import IRunner from '../../interfaces/IRunner';
import Social from './Social';

export default class WeeklySocial extends Social implements IRunner {
  async run() {
    this.weeklySocial();
  }
}
