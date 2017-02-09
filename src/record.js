import fs from 'fs' ;
import request from 'request';
import path from 'path';

export default function record(cb) {
  console.log('Start Recording');

  request.post({
    url: process.env.RADIO_HOOK,
    body: {
      text: 'Started recording',
      username: 'Merc Bot',
      icon_emoji: ':mercury:',
    },
    json: true,
  });

  const fileName = path.normalize(path.join('./output', `${Date.now()}.mp3`));

  const stream = request('http://rubix.wavestreamer.com:3203/Live')
                  .pipe(fs.createWriteStream(fileName));

  setTimeout(() => {
    console.log('Ending Recording');

    request.post({
      url: process.env.RADIO_HOOK,
      body: {
        text: 'Ending recording',
        username: 'Merc Bot',
        icon_emoji: ':mercury:',
      },
      json: true,
    }, (err) => {
      stream.end();
      cb();
    });
  }, 4200000);
}
