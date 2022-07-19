#!/usr/bin/env node
import { program } from 'commander';
import { join } from 'path';
import { readFileSync } from 'fs';
import init from './commands/init';
import NpmOperate from '@lough/npm-operate';
import LoughRollup from './utils/rollup';

function start() {
  const jsonPath = join(__dirname, '../package.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  const jsonResult = JSON.parse(jsonContent);
  program.version(jsonResult.version);

  program.command(init.command).description(init.description).action(init.action);

  program.action((...args) => {
    console.log('order', args);

    const npm = new NpmOperate();

    const config = npm.readConfig();

    // const map = {
    //   main: 'cjs',
    //   module: 'es',
    //   unpkg: 'umd',
    //   types: 'dts'
    // };
    const pack = {} as any;
    const banner = `/*!
*
* ${pack.name} ${pack.version}
*
* Copyright 2021-present, ${pack.title}, Inc.
* All rights reserved.
*
*/`;

    const globals = {};
    const external = [''];

    const loughRollup = new LoughRollup({ input: config.source, external, output: [] });

    if (config.unpkg) {
      // TODO: inputPlugin
      loughRollup.addOutputOption({
        format: 'umd',
        name: 'lyricalJs',
        globals,
        assetFileNames: '[name].[ext]',
        file: 'dist/index.js',
        banner
      });
    }

    if (config.main) {
      //
    }

    if (config.module) {
      //
    }

    if (config.types) {
      //
    }
  });

  program.parseAsync(process.argv);
}

start();
