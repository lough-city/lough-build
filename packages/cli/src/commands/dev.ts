import { startSpinner } from '../utils/spinner';
import fs from 'fs';
import build from './build';

const action = async () => {
  const rootPath = process.cwd();

  startSpinner('dev watch: ' + rootPath);

  fs.watch(rootPath, build.action);
};

export default {
  command: 'dev',
  description: 'Dev.',
  action
};
