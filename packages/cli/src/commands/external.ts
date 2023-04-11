import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Package } from '@lough/npm-operate';
import { CONFIG_FILE_NAME } from '../constants/config';
import { copyFileSync } from '../utils/file';
import { startLoadingSpinner, succeedLoadingSpinner } from '../utils/spinner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface IOptions {
  rootPath?: string;
  external?: boolean;
  globals?: boolean;
}

const action = async (options: IOptions = {}) => {
  const { rootPath, external = true, globals = true } = options;
  const npm = new Package({ dirName: rootPath });

  startLoadingSpinner(`开始扫描 ${npm.name}`);
  const dependencies = Object.keys(npm.readConfig().dependencies || {});
  succeedLoadingSpinner(`扫描到 ${dependencies.length} 个依赖`);

  if (!dependencies.length) return;

  const configPath = join(npm.options.dirName, CONFIG_FILE_NAME);

  startLoadingSpinner(`开始写入 external`);

  const externalStr = dependencies.map(v => `'${v}'`).join(', ');
  const globalsStr = dependencies
    .map(v => `'${v}': '${v.replace('@', '').replace(/[-_/]([a-z])/g, (_$0, $1) => $1.toUpperCase())}'`)
    .join(', ');

  // TODO: 如果存在配置根据配置是否有分别生成
  copyFileSync(
    existsSync(configPath) ? configPath : join(__dirname, `../templates/${CONFIG_FILE_NAME}`),
    configPath,
    v => {
      if (external) v = v.replace(/(external:)\s*\[[\s\S]*?\]/, `$1 [${externalStr}]`);
      if (globals) v = v.replace(/(globals:)\s*\{[\s\S]*?\}/, `$1 {${globalsStr}}`);
      return v;
    }
  );

  succeedLoadingSpinner(`写入 external 成功`);
};

export default {
  command: 'external',
  description: 'Scan dependencies are added as external modules.',
  action
};
