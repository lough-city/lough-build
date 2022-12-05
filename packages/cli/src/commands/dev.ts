import chokidar from 'chokidar';
import build from './build';
import { startSpinner } from '../utils/spinner';

const action = async () => {
  const rootPath = process.cwd();

  startSpinner('dev watch: ' + rootPath);

  const lyricalJs = await import('@lyrical/js');

  const buildDebounce = lyricalJs.createDebounceInterval(build.action, { interval: 500 });

  buildDebounce();

  chokidar.watch(rootPath).on('change', buildDebounce);
};

export default {
  command: 'dev',
  description: 'Dev.',
  action
};
