import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Package } from '@lough/npm-operate';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import { PROJECT_TYPE, PROJECT_TYPE_LABEL } from '../constants';
import { CONFIG_FILE_NAME } from '../constants/config';
import { copyFileSync } from '../utils/file';
import { startLoadingSpinner, succeedLoadingSpinner, succeedSpinner } from '../utils/spinner';
import external from './external';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PACKAGE = '@lough/build-cli';

const getSub = (keyList: Array<string>) =>
  prompt<{ key: string }>([
    {
      type: 'list',
      name: 'key',
      message: `Please select need initialized package:`,
      choices: keyList
    }
  ]).then(res => res.key);

const getProjectType = () =>
  prompt<{ type: string }>([
    {
      type: 'list',
      name: 'type',
      message: `Please select project type:`,
      choices: Object.keys(PROJECT_TYPE).map(key => ({
        name: `${key} ${PROJECT_TYPE_LABEL[key as keyof typeof PROJECT_TYPE]}`,
        value: PROJECT_TYPE[key as keyof typeof PROJECT_TYPE]
      }))
    }
  ]).then(res => res.type);

const action = async () => {
  let npm = new Package();

  if (npm.options.isWorkspaces) {
    const key = await getSub([npm.name, ...npm.children.map(item => item.name)]);
    const item = npm.children.find(item => item.name === key);

    if (item) npm = item;
  }

  const projectType = await getProjectType();

  startLoadingSpinner(`开始安装 ${PACKAGE}`);
  npm.uninstall(PACKAGE);
  npm.installDev(PACKAGE);
  succeedLoadingSpinner('安装成功');

  /* 配置写入 */
  startLoadingSpinner(`开始写入 package.json`);
  const config = npm.readConfig();
  if (!config.scripts) config.scripts = {};
  config.scripts.build = 'lough-build';
  config.scripts.dev = 'lough-build dev';
  config.type = 'module';
  config.main = 'es/index.js';
  if (projectType !== PROJECT_TYPE.cli) config.unpkg = 'dist/index.min.js';
  config.types = 'es/index.d.ts';
  if (projectType === PROJECT_TYPE.cli) {
    config.bin = { ...(config.bin || {}), [config.name]: 'es/index.js' };
  }
  config.files = Array.from(new Set([...(config.files || [], 'dist', 'lib', 'es')]));
  npm.writeConfig(config);
  succeedLoadingSpinner('写入 package.json 成功');

  if (projectType === PROJECT_TYPE.componentLib) {
    /* 打包配置写入 */
    startLoadingSpinner(`开始写入 ${CONFIG_FILE_NAME}`);
    copyFileSync(join(__dirname, `../templates/${CONFIG_FILE_NAME}`), join(npm.options.dirName, CONFIG_FILE_NAME));
    succeedLoadingSpinner(`写入 ${CONFIG_FILE_NAME} 成功`);

    external.action({ rootPath: npm.options.dirName });
  }

  if (projectType === PROJECT_TYPE.cli) {
    /* 打包配置写入 */
    startLoadingSpinner(`开始写入 ${CONFIG_FILE_NAME}`);
    copyFileSync(join(__dirname, `../templates/${CONFIG_FILE_NAME}`), join(npm.options.dirName, CONFIG_FILE_NAME), v =>
      v.replace(/(style:)\strue?/, `$1 false`)
    );
    succeedLoadingSpinner(`写入 ${CONFIG_FILE_NAME} 成功`);

    external.action({ rootPath: npm.options.dirName, globals: false });
  }

  succeedSpinner(chalk.green('Lough Build 初始化成功!'));
};

export default {
  command: 'init',
  description: 'init project build function.',
  action
};
