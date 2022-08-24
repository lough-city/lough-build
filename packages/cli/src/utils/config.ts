import { Package } from '@lough/npm-operate';
import { bundleRequire } from 'bundle-require';
import { GenerateConfig, LoughBuildConfig } from '../typings/config';
import { join, resolve } from 'path';
import { existsSync, readdirSync } from 'fs';

export const getBanner = (config: Package) => {
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
  const loughConfigPath = join(rootPath, 'lough.build.config.ts');
  if (!existsSync(loughConfigPath)) return undefined;

  const {
    mod: { default: loughBuildConfig }
  } = await bundleRequire({
    filepath: loughConfigPath
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

export const getGenerateConfig = async (rootPath: string, config: Package) => {
  const buildConfig = await getLoughBuildConfig(rootPath);
  const componentDir = buildConfig?.componentDir ?? 'src/components';
  const styleDirList = existsSync(join(rootPath, componentDir)) ? getComponentStyle(join(rootPath, componentDir)) : [];

  const generateConfig: Readonly<GenerateConfig> = {
    input: buildConfig?.input ?? 'src/index.ts',
    style: buildConfig?.style ?? false,
    globals: buildConfig?.globals ?? {},
    external: buildConfig?.external ?? [],
    componentDir,
    styleDirList,
    config,
    title: getTitle(config.name),
    banner: getBanner(config),
    rootPath
  };

  return generateConfig;
};
