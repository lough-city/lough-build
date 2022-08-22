#!/usr/bin/env node
import { program } from 'commander';
import { parse, join } from 'path';
import { readFileSync } from 'fs';
import init from './commands/init';
import NpmOperate from '@lough/npm-operate';
import { RollupInputOptions, RollupOutputOptions } from './utils/rollupConfig';
import { bundleRequire } from 'bundle-require';
import { LoughBuildConfig } from './typings/config';

function start() {
  const jsonPath = join(__dirname, '../package.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  const jsonResult = JSON.parse(jsonContent);
  program.version(jsonResult.version);

  program.command(init.command).description(init.description).action(init.action);

  program.action(async (...args) => {
    const npm = new NpmOperate();

    const config = npm.readConfig();
    const {
      mod: { default: loughBuildConfig }
    } = await bundleRequire({
      filepath: join(process.cwd(), 'lough.build.config.ts')
    });

    const buildConfig = loughBuildConfig as LoughBuildConfig;

    // init

    // react components
    // lib
    // node
    // js

    // custom
    // cjs
    //  style
    //  declaration
    // es
    //  style
    //  declaration
    // umd

    // const map = {
    //   main: 'cjs',
    //   module: 'es',
    //   unpkg: 'umd',
    //   types: 'dts'
    //   style: 'css'
    // };
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

    const { input, style, globals, external } = buildConfig;

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
        .file(config.unpkg.replace('.min', ''))
        .banner(banner);

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
        .file(config.unpkg)
        .banner(banner)
        .terser();
    }

    // type: commonjs | module | undefined
    // if(module) es
    // else if(commonjs) lib if(config.module) es
    // else lib if(config.module) es

    if (config.main && config.type !== 'module') {
      const cjsInputOptions = new RollupInputOptions()
        .input([input])
        .external(external)
        .image()
        .resolve()
        .babel()
        .commonjs();
      if (style) cjsInputOptions.style();
      if (config.types)
        cjsInputOptions.typescript({ jsx: 'preserve', check: false, tsconfigOverride: { noEmit: true } });

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
      if (config.types)
        esInputOptions.typescript({ jsx: 'preserve', check: false, tsconfigOverride: { noEmit: true } });

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
    }
  });

  program.parseAsync(process.argv);
}

start();
