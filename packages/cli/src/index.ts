#!/usr/bin/env node
import { program } from 'commander';
import { parse, join } from 'path';
import { readFileSync } from 'fs';
import init from './commands/init';
import NpmOperate from '@lough/npm-operate';
import { RollupInputOptions, RollupOutputOptions } from './utils/rollupConfig';

function start() {
  const jsonPath = join(__dirname, '../package.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  const jsonResult = JSON.parse(jsonContent);
  program.version(jsonResult.version);

  program.command(init.command).description(init.description).action(init.action);

  program.action((...args) => {
    const npm = new NpmOperate();

    const config = npm.readConfig();

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
* Copyright 2021-present, ${config.author}, Inc.
* All rights reserved.
*
*/`;

    const external = ['react', 'react-dom', '@lyrical/js'];
    const globals = { react: 'React', 'react-dom': 'ReactDOM', '@lyrical/js': 'lyricalJs' };
    const style = true;

    if (config.unpkg) {
      const umdInputOptions = new RollupInputOptions()
        .input('src/index.umd.ts')
        .external(external)
        .image()
        .resolve()
        .babel()
        .commonjs();
      if (style) umdInputOptions.style();

      const umdOutputOptions = new RollupOutputOptions()
        .format(map => map.umd)
        .name(config.title)
        .globals(globals)
        .assetFileNames()
        .file((config.unpkg as string).replace('.min', ''))
        .banner(banner);

      const unpkgInputOptions = new RollupInputOptions()
        .input('src/index.umd.ts')
        .external(external)
        .image()
        .resolve()
        .babel()
        .commonjs();
      if (style) unpkgInputOptions.style({ minimize: true });

      const unpkgOutputOptions = new RollupOutputOptions()
        .format(map => map.umd)
        .name(config.title)
        .globals(globals)
        .assetFileNames()
        .file(config.unpkg)
        .banner(banner)
        .terser();
    }

    if (config.main) {
      const cjsInputOptions = new RollupInputOptions()
        .input(['src/index.ts'])
        .external(external)
        .image()
        .resolve()
        .babel()
        .commonjs();
      if (style) cjsInputOptions.style();
      if (config.types) cjsInputOptions.typescript({ jsx: 'preserve' });

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

    if (config.module) {
      const esInputOptions = new RollupInputOptions()
        .input(['src/index.ts'])
        .external(external)
        .image()
        .resolve()
        .babel()
        .commonjs();
      if (style) esInputOptions.style();
      if (config.typings) esInputOptions.typescript({ jsx: 'preserve' });

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
