import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { IPackage } from '@lough/npm-operate';
import { CONFIG_FILE_NAME } from '../constants/config';
import { GenerateConfig, LoughBuildConfig } from '../typings/config';
import { loadTsFileRuntime } from './loadTsFile';

export const getBanner = (config: IPackage, copyright?: string) => {
  const copyrightText = copyright
    ? copyright
        .split(/\r?\n/)
        .map(item => (item ? `  * ${item}` : '  *'))
        .join('\n')
    : `  * Copyright 2021-present, ${(typeof config.author === 'string' ? config.author : config.author?.name) ?? ''}.
  * All rights reserved.
  *`;

  return `/*!
  *
  * ${config.name} ${config.version}
  *
${copyrightText}
  */`;
};

export const getTitle = (name: string) => {
  return name
    .replace('@', '')
    .replace('/', '-')
    .replace(/-(\w)/g, (_$0, $1) => $1.toUpperCase())
    .replace(/([\w])/, (_$0, $1) => $1.toUpperCase());
};

export const getLoughBuildConfig = async (rootPath: string) => {
  const loughConfigPath = join(rootPath, CONFIG_FILE_NAME);
  if (!existsSync(loughConfigPath)) return {} as Partial<LoughBuildConfig>;

  const loughBuildConfig = await loadTsFileRuntime(loughConfigPath);

  return (loughBuildConfig || {}) as Partial<LoughBuildConfig>;
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

export const getGenerateConfig = async (rootPath: string, config: IPackage) => {
  const buildConfig = await getLoughBuildConfig(rootPath);
  const componentDir = buildConfig?.componentDir ?? 'src/components';
  const styleDirList = existsSync(join(rootPath, componentDir)) ? getComponentStyle(join(rootPath, componentDir)) : [];
  const copyright = existsSync(join(rootPath, 'LICENSE'))
    ? readFileSync(join(rootPath, 'LICENSE'), { encoding: 'utf-8' })
    : undefined;

  const generateConfig: Readonly<GenerateConfig> = {
    input: buildConfig.input ?? 'src/index.ts',
    style: buildConfig.style ?? false,
    globals: buildConfig.globals ?? {},
    external: buildConfig.external ?? [],
    terser: buildConfig.terser ?? false,
    componentDir,
    styleDirList,
    config,
    title: getTitle(config.name),
    banner: getBanner(config, copyright),
    rootPath
  };

  return generateConfig;
};
