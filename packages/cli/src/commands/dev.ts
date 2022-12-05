import { join } from 'path';
import chokidar from 'chokidar';
import build from './build';
import { startSpinner } from '../utils/spinner';
import createDebounceInterval from '../utils/debounceInterval';

const buildDebounce = createDebounceInterval(build.action, { interval: 500 });

const action = async () => {
  const rootPath = join(process.cwd(), 'src');

  await buildDebounce();

  startSpinner('dev watch: ' + rootPath);

  chokidar.watch(join(rootPath, 'src')).on('change', buildDebounce);
};

export default {
  command: 'dev',
  description: 'Dev.',
  action
};
