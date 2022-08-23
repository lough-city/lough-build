#!/usr/bin/env node
import { program } from 'commander';
import { join, resolve } from 'path';
import { readFileSync, existsSync, readdirSync } from 'fs';
import init from './commands/init';
import NpmOperate from '@lough/npm-operate';
import { bundleRequire } from 'bundle-require';
import { GenerateConfig, LoughBuildConfig } from './typings/config';
import { LoughRollup, generateUmd, generateUnpkg, generateCommonJS, generateESModule } from './core';
import { failLoadingSpinner, startLoadingSpinner, succeedLoadingSpinner } from './utils/spinner';

const getLoughBuildConfig = async (path: string) => {
  const {
    mod: { default: loughBuildConfig }
  } = await bundleRequire({
    filepath: join(process.cwd(), 'lough.build.config.ts')
  });

  return loughBuildConfig as LoughBuildConfig;
};

const getComponentStyle = (componentDir: string) => {
  const cModuleNames = readdirSync(resolve(componentDir));
  const styleEntryFiles = cModuleNames
    .map(name =>
      /^[A-Z]\w*/.test(name) && existsSync(`${componentDir}/${name}/style/index.tsx`)
        ? `${componentDir}/${name}/style/index.tsx`
        : undefined
    )
    .filter(Boolean);

  return styleEntryFiles as Array<string>;
};

function start() {
  const jsonPath = join(__dirname, '../package.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  const jsonResult = JSON.parse(jsonContent);
  program.version(jsonResult.version);

  program.command(init.command).description(init.description).action(init.action);

  program.action(async (...args) => {
    const config = new NpmOperate().readConfig();
    const rootPath = join(process.cwd(), 'lough.build.config.ts');

    const buildConfig = existsSync(rootPath) ? await getLoughBuildConfig(rootPath) : undefined;

    const banner = `/*!
*
* ${config.name} ${config.version}
*
* Copyright 2021-present, ${config.author}.
* All rights reserved.
*
*/`;

    const title = config.name
      .replace('@', '')
      .replace('/', '-')
      .replace(/-(\w)/g, (_$0, $1) => $1.toUpperCase())
      .replace(/([\w])/, (_$0, $1) => $1.toUpperCase());

    const componentDir = buildConfig?.componentDir ?? 'src/components';

    const styleDirList = existsSync(join(process.cwd(), componentDir))
      ? getComponentStyle(join(process.cwd(), componentDir))
      : [];

    const generateConfig: Readonly<GenerateConfig> = {
      input: buildConfig?.input ?? 'src/index.ts',
      style: buildConfig?.style ?? false,
      globals: buildConfig?.globals ?? {},
      external: buildConfig?.external ?? [],
      componentDir,
      styleDirList,
      config,
      title,
      banner
    };

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
