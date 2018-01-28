import * as fs from 'fs' ;
import * as request from 'request';
import * as rp from 'request-promise-native';
import * as path from 'path';
import * as s3 from 's3';
import * as moment from 'moment';

import IRunner from '../../interfaces/IRunner';
import { setTimeout } from 'timers';
import { Moment } from 'moment';

export default class Record implements IRunner {
  async run() {
    const date = moment().format('MM-DD-YY');
    const filename = `${date}-${Date.now()}.mp3`;

    const milliseconds = 4200000;
    const endTime = moment().add(milliseconds, 'milliseconds');

    console.log('Start Recording');

    await this.postToSlack('Started recording');

    const filepath = path.normalize(path.join('./output', filename));

    let stream: any;

    try {
      stream = await this.retryForever(this.stream, filepath, endTime);
    } catch (e) {
      console.log(e);
    }

    console.log('Ending Recording');

    await this.postToSlack('Ending recording');

    stream.end();

    let data: any;

    try {
      data = await this.upload(filepath, filename, stream);
    } catch (e) {
      throw e;
    }
    
    const url = `https://newshub.nyc3.digitaloceanspaces.com/${filename}`;
    
    await this.postToSlack(`Recording uploaded to ${url}`);
  }

  private retryForever(fn: any, ...args: Array<any>) {
    return fn(...args).catch((err: any) => {
      console.log(err);
      console.log('Retrying');
      
      return this.retryForever(fn, ...args); 
    });
  }

  private stream(filepath: any, endTime: Moment): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('Streaming');

      const remaining = moment(endTime).diff(moment());

      let stream = request('http://rubix.wavestreamer.com:3203/Live')
        .on('error', function (err) {
          console.log(err);

          stream.end();

          reject(err);
        })
        .pipe(fs.createWriteStream(filepath));

      setTimeout(() => {
        console.log('Resolving');

        resolve(stream);
      }, remaining);
    });
  }

  private postToSlack(text: string): Promise<any> {
    return rp({
      method: 'POST',
      url: process.env.RADIO_HOOK,
      body: {
        text,
        username: 'Merc Bot',
        icon_emoji: ':mercury:',
      },
      json: true,
    });
  }

  private async upload(filepath: string, filename: string, stream: any) {
    return new Promise((resolve, reject) => {
      const client = s3.createClient({
        s3Options: {
          accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID,
          secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY,
          endpoint: 'nyc3.digitaloceanspaces.com',
        },
      });

      const params = {
        localFile: filepath,
        s3Params: {
          Bucket: 'newshub',
          Key: filename,
          ACL: 'public-read',
        },
      };

      const uploader = client.uploadFile(params);

      uploader.on('error', (err: any) => {
        reject(err);
      });

      uploader.on('end', () => {
        resolve(uploader);
      });
    });
  }
}
