import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const readFile = util.promisify(fs.readFile);

import RecordConfig from '../features/record/RecordConfig';
import SocialConfig from '../features/social/SocialConfig';

export default class Config {
  record: RecordConfig;
  dailySocial: SocialConfig;
  weeklySocial: SocialConfig;

  static async load(filename: string): Promise<Config> {
    let filepath = path.normalize(path.join('./', filename));

    let config: Config;

    try {
      config = <Config>JSON.parse((await readFile(filepath)).toString());
    } catch (e) {
      throw e;
    }

    return config;
  }
}
