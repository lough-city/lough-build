import chokidar from 'chokidar';
import build from './build';
import { startSpinner } from '../utils/spinner';
import createDebounceInterval from '../utils/debounceInterval';

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
