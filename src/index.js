const dotenv = require('dotenv').config();

import task from './task';
import record from './record';
import social from './social';

import config from './config';

if (config.social) {
  social();
}

if (config.radio) {
  task();
}
