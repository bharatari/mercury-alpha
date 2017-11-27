import IRunner from '../../interfaces/IRunner';
import Social from './Social';

export default class DailySocial extends Social implements IRunner {
  async run() {
    this.dailySocial();
  }
}

