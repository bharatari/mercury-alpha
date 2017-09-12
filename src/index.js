const dotenv = require('dotenv').config();

import { recordTask, dailySocialTask, weeklySocialTask } from './task';
import record from './record';
import social from './social';

import config from './config';

if (config.dailySocial) {
  const { task, now } = config.dailySocial;

  if (task) {
    dailySocialTask();
  }

  if (now) {
    social.dailySocial();
  }
}

if (config.weeklySocial) {
  const { task, now } = config.weeklySocial;

  if (task) {
    weeklySocialTask();
  }

  if (now) {
    social.weeklySocial();
  }
}

if (config.record) {
  const { task, now, crontab } = config.record;

  if (task) {
    recordTask(crontab);
  }

  if (now) {
    record();
  }
}
