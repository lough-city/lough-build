#!/usr/bin/env node
import { program } from 'commander';
import { parse, join } from 'path';
import { readFileSync, existsSync } from 'fs';
import init from './commands/init';
import NpmOperate from '@lough/npm-operate';
import { RollupInputOptions, RollupOutputOptions } from './utils/rollupConfig';
import { bundleRequire } from 'bundle-require';
import { LoughBuildConfig } from './typings/config';
import LoughRollup from './utils/rollup';

const getLoughBuildConfig = async (path: string) => {
  const {
    mod: { default: loughBuildConfig }
  } = await bundleRequire({
    filepath: join(process.cwd(), 'lough.build.config.ts')
  });

  return loughBuildConfig as LoughBuildConfig;
};

function start() {
  const jsonPath = join(__dirname, '../package.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  const jsonResult = JSON.parse(jsonContent);
  program.version(jsonResult.version);

  program.command(init.command).description(init.description).action(init.action);

  program.action(async (...args) => {
    const npm = new NpmOperate();
    const config = npm.readConfig();
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

    const { input = 'src/index.ts', style = false, globals = {}, external = [] } = buildConfig || {};

    if (config.unpkg) {
      const umdInputOptions = new RollupInputOptions()
        .input(input)
        .external(external)
        .image()
        .resolve()
        .babel()
        .commonjs();
      if (style) umdInputOptions.style();

      const umdOutputOptions = new RollupOutputOptions()
        .format(map => map.umd)
        .name(title)
        .globals(globals)
        .assetFileNames()
        .file('dist/index.js')
        .banner(banner);

      await new LoughRollup(umdInputOptions.options).addOutputOption(umdOutputOptions.options).build();

      const unpkgInputOptions = new RollupInputOptions()
        .input(input)
        .external(external)
        .image()
        .resolve()
        .babel()
        .commonjs();
      if (style) unpkgInputOptions.style({ minimize: true });

      const unpkgOutputOptions = new RollupOutputOptions()
        .format(map => map.umd)
        .name(title)
        .globals(globals)
        .assetFileNames()
        .file('dist/index.min.js')
        .banner(banner)
        .terser();

      await new LoughRollup(unpkgInputOptions.options).addOutputOption(unpkgOutputOptions.options).build();
    }

    if (config.main && config.type !== 'module') {
      const cjsInputOptions = new RollupInputOptions()
        .input([input])
        .external(external)
        .image()
        .resolve()
        .babel()
        .commonjs();
      if (style) cjsInputOptions.style();
      if (config.types) cjsInputOptions.typescript({ jsx: 'preserve', check: false });

      const cjsOutputOptions = new RollupOutputOptions()
        .format(map => map.cjs)
        .preserveModules()
        .globals(globals)
        .exports()
        .assetFileNames(({ name }) => {
          const { ext, dir, base } = parse(name as string);
          if (ext !== '.css') return '[name].[ext]';
          return join(dir, base);
        });

      await new LoughRollup(cjsInputOptions.options).addOutputOption(cjsOutputOptions.options).build();
    }

    if (config.module || config.type === 'module') {
      const esInputOptions = new RollupInputOptions()
        .input([input])
        .external(external)
        .image()
        .resolve()
        .babel()
        .commonjs();
      if (style) esInputOptions.style();
      if (config.types) esInputOptions.typescript({ jsx: 'preserve', check: false });

      const esOutputOptions = new RollupOutputOptions()
        .format(map => map.es)
        .preserveModules()
        .globals(globals)
        .exports()
        .assetFileNames(({ name }) => {
          const { ext, dir, base } = parse(name as string);
          if (ext !== '.css') return '[name].[ext]';
          return join(dir, base);
        });
      await new LoughRollup(esInputOptions.options).addOutputOption(esOutputOptions.options).build();
    }
  });

  program.parseAsync(process.argv);
}

start();

export const defineConfig = (config: LoughBuildConfig) => config;
