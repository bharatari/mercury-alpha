const dotenv = require('dotenv').config();

import Run from './models/Run';

const run = new Run();

run.start();
