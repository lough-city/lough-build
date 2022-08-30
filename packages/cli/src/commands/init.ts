import { prompt } from 'inquirer';
import chalk from 'chalk';
import NpmOperate from '@lough/npm-operate';
import { PROJECT_TYPE, PROJECT_TYPE_LABEL } from '../constants';
import { CONFIG_FILE_NAME } from '../constants/config';
import { join } from 'path';
import { copyFileSync } from '../utils/file';
import { startLoadingSpinner, succeedLoadingSpinner, succeedSpinner, textLoadingSpinner } from '../utils/spinner';

const getSub = (keyList: Array<string>) =>
  prompt<{ key: string }>([
    {
      type: 'list',
      name: 'key',
      message: `检测到项目为多包项目，请选择一个子包以继续进行:`,
      choices: keyList
    }
  ]).then(res => res.key);

const getProjectType = () =>
  prompt<{ type: string }>([
    {
      type: 'list',
      name: 'type',
      message: `请选择项目类型:`,
      choices: Object.keys(PROJECT_TYPE).map(key => ({
        name: `${key} ${PROJECT_TYPE_LABEL[key as keyof typeof PROJECT_TYPE]}`,
        value: PROJECT_TYPE[key as keyof typeof PROJECT_TYPE]
      }))
    }
  ]).then(res => res.type);

const packageName = '@lough/build-cli';

const action = async () => {
  const rootPath = process.cwd();
  const parent = new NpmOperate({ rootPath });
  let npm = parent;

  if (parent.isLernaProject) {
    const key = await getSub(Object.keys(parent.packages));
    const subPackage = parent.packages[key];

    npm = new NpmOperate({ rootPath: subPackage.absolutePath });
  }

  const projectType = await getProjectType();

  startLoadingSpinner(`开始安装 ${packageName}`);
  parent.isLernaProject ? parent.uninstallLerna(packageName, npm.readConfig().name) : npm.uninstall(packageName);
  parent.isLernaProject ? parent.installDevLerna(packageName, npm.readConfig().name) : npm.installDev(packageName);
  succeedLoadingSpinner('安装成功');

  /* 配置写入 */
  startLoadingSpinner(`开始写入 package.json`);
  const config = npm.readConfig();
  if (!config.scripts) config.scripts = {};
  config.scripts.build = 'lough-build';
  config.type = 'module';
  config.main = 'es/index.js';
  config.unpkg = 'dist/index.min.js';
  config.types = 'es/index.d.ts';
  npm.writeConfig(config);
  succeedLoadingSpinner('写入 package.json 成功');

  if (projectType === PROJECT_TYPE.componentLib) {
    /* 打包配置写入 */
    startLoadingSpinner(`开始写入 ${CONFIG_FILE_NAME}`);
    copyFileSync(
      join(__dirname, `../templates/${CONFIG_FILE_NAME}`),
      join(
        parent.isLernaProject ? parent.packages[npm.readConfig().name].absolutePath : process.cwd(),
        CONFIG_FILE_NAME
      )
    );
    succeedLoadingSpinner(`写入 ${CONFIG_FILE_NAME} 成功`);
  }

  succeedSpinner(chalk.green('Lough Build 初始化成功!'));
};

export default {
  command: 'init',
  description: 'init project build function.',
  action
};
