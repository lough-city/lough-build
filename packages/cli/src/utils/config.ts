import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { IPackage } from '@lough/npm-operate';
import { bundleRequire } from 'bundle-require';
import { CONFIG_FILE_NAME } from '../constants/config';
import { GenerateConfig, LoughBuildConfig } from '../typings/config';

export const getBanner = (config: IPackage) => {
  return `/*!
  *
  * ${config.name} ${config.version}
  *
  * Copyright 2021-present, ${(typeof config.author === 'string' ? config.author : config.author?.name) ?? ''}.
  * All rights reserved.
  *
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

  const {
    mod: { default: loughBuildConfig }
  } = await bundleRequire({
    filepath: loughConfigPath
  });

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

  const generateConfig: Readonly<GenerateConfig> = {
    input: buildConfig.input ?? 'src/index.ts',
    style: buildConfig.style ?? false,
    globals: buildConfig.globals ?? {},
    external: buildConfig.external ?? [],
    componentDir,
    styleDirList,
    config,
    title: getTitle(config.name),
    banner: getBanner(config),
    rootPath
  };

  return generateConfig;
};
