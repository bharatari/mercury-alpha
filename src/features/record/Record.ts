import * as fs from 'fs' ;
import * as request from 'request-promise-native';
import * as path from 'path';
import * as s3 from 's3';

import IRunner from '../../interfaces/IRunner';

export default class Record implements IRunner {
  async run() {
    const filename = `${Date.now()}.mp3`;

    console.log('Start Recording');

    await this.postToSlack('Started recording');

    const filepath = path.normalize(path.join('./output', filename));

    const stream = await request('http://rubix.wavestreamer.com:3203/Live')
                    .pipe(fs.createWriteStream(filepath));

    setTimeout(async () => {
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
      await this.postToSlack(`Recording uploaded to ${url}`)
    }, 4200000);
  }

  private postToSlack(text: string): Promise<any> {
    return request({
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
