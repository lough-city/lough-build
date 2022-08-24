#!/usr/bin/env node
import { program } from 'commander';
import { join } from 'path';
import { readFileSync } from 'fs';
import init from './commands/init';
import NpmOperate from '@lough/npm-operate';
import { LoughBuildConfig } from './typings/config';
import { generateUmd, generateUnpkg, generateCommonJS, generateESModule } from './core';
import { failLoadingSpinner, startLoadingSpinner, succeedLoadingSpinner } from './utils/spinner';
import { getGenerateConfig } from './utils/config';

function start() {
  const jsonPath = join(__dirname, '../package.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  const jsonResult = JSON.parse(jsonContent);
  program.version(jsonResult.version);

  program.command(init.command).description(init.description).action(init.action);

  program.action(async () => {
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
  });

  program.parseAsync(process.argv);
}

start();

export const defineConfig = (config: Partial<LoughBuildConfig>) => config;
