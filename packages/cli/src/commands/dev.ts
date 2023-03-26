import { join } from 'path';
import chokidar from 'chokidar';
import createDebounceInterval from '../utils/debounceInterval';
import { startSpinner } from '../utils/spinner';
import build from './build';

const buildDebounce = createDebounceInterval(build.action, { interval: 500 });

const action = async () => {
  const rootPath = join(process.cwd(), 'src');

  await buildDebounce();

  startSpinner('dev watch: ' + rootPath);

  chokidar.watch(rootPath).on('change', buildDebounce);
};

export default {
  command: 'dev',
  description: 'Dev.',
  action
};
