import NpmOperate from '@lough/npm-operate';
import { generateUmd, generateUnpkg, generateCommonJS, generateESModule } from '../core';
import { failLoadingSpinner, startLoadingSpinner, succeedLoadingSpinner } from '../utils/spinner';
import { getGenerateConfig } from '../utils/config';

const action = async () => {
  const rootPath = process.cwd();
  const config = new NpmOperate({ rootPath }).readConfig();

  const generateConfig = await getGenerateConfig(rootPath, config);

  if (config.unpkg) {
    startLoadingSpinner('umd: 开始打包');

    if (await generateUmd(generateConfig)) succeedLoadingSpinner('umd: 打包成功');
    else failLoadingSpinner('umd: 打包失败');

    startLoadingSpinner('unpkg: 开始打包');

    if (await generateUnpkg(generateConfig)) succeedLoadingSpinner('unpkg: 打包成功');
    else failLoadingSpinner('unpkg: 打包失败');
  }

  if (config.main && config.type !== 'module') {
    startLoadingSpinner('cjs: 开始打包');

    if (await generateCommonJS(generateConfig)) succeedLoadingSpinner('cjs: 打包成功');
    else failLoadingSpinner('cjs: 打包失败');
  }

  if (config.module || config.type === 'module') {
    startLoadingSpinner('es: 开始打包');

    if (await generateESModule(generateConfig)) succeedLoadingSpinner('es: 打包成功');
    else failLoadingSpinner('es: 打包失败');
  }
};

export default {
  command: 'build',
  description: 'Build.',
  action
};
