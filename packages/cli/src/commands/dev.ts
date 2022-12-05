import chokidar from 'chokidar';
import { createDebounceInterval } from '@lyrical/js';
import build from './build';
import { startSpinner } from '../utils/spinner';

const buildDebounce = createDebounceInterval(build.action, { interval: 500 });

const action = async () => {
  const rootPath = process.cwd();

  startSpinner('dev watch: ' + rootPath);

  buildDebounce();

  chokidar.watch(rootPath).on('change', buildDebounce);
};

export default {
  command: 'dev',
  description: 'Dev.',
  action
};
