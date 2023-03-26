import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Package } from '@lough/npm-operate';
import { CONFIG_FILE_NAME } from '../constants/config';
import { copyFileSync } from '../utils/file';
import { startLoadingSpinner, succeedLoadingSpinner } from '../utils/spinner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const action = async () => {
  const npm = new Package();

  startLoadingSpinner(`开始扫描 ${npm.name}`);
  const dependencies = Object.keys(npm.readConfig().dependencies || {});
  succeedLoadingSpinner(`扫描到 ${dependencies.length} 个依赖`);

  if (!dependencies.length) return;

  const configPath = join(npm.options.dirName, CONFIG_FILE_NAME);

  startLoadingSpinner(`开始写入 external`);

  const external = dependencies.map(v => `'${v}'`).join(' ,');
  const globals = dependencies
    .map(v => `'${v}': '${v.replace('@', '').replace(/[-_/]([a-z])/g, (_$0, $1) => $1.toUpperCase())}'`)
    .join(', ');

  if (existsSync(configPath)) {
    copyFileSync(configPath, configPath, v =>
      v
        .replace(/(external:)\s*\[[\s\S]*?\]/, `$1 [${external}]`)
        .replace(/(globals:)\s*\{[\s\S]*?\}/, `$1 {${globals}}`)
    );
  } else {
    copyFileSync(join(__dirname, `../templates/${CONFIG_FILE_NAME}`), join(npm.options.dirName, CONFIG_FILE_NAME), v =>
      v
        .replace(/(external:)\s*\[[\s\S]*?\]/, `$1 [${external}]`)
        .replace(/(globals:)\s*\{[\s\S]*?\}/, `$1 {${globals}}`)
    );
  }

  succeedLoadingSpinner(`写入 external 成功`);
};

export default {
  command: 'external',
  description: 'Scan dependencies are added as external modules.',
  action
};
