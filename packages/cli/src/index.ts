#!/usr/bin/env node
import { program } from 'commander';
import { join } from 'path';
import { readFileSync } from 'fs';
import init from './commands/init';
import NpmOperate from '@lough/npm-operate';
import LoughRollup from './utils/rollup';
import styles from 'rollup-plugin-styles';
import autoprefixer from 'autoprefixer';
import { terser } from 'rollup-plugin-terser';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const commonPlugins = [
  /* 将图片打包进 js */
  image(),
  /* 自动匹配文件后缀 */
  resolve({ extensions: ['.ts', '.tsx'] }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'runtime',
    extensions: ['.ts', '.tsx'],
    skipPreflightCheck: true,
    presets: ['@babel/preset-react', '@babel/preset-typescript']
  }),
  commonjs()
];

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
    const pack = {} as any;
    const banner = `/*!
*
* ${pack.name} ${pack.version}
*
* Copyright 2021-present, ${pack.title}, Inc.
* All rights reserved.
*
*/`;

    const external = ['react', 'react-dom', '@lyrical/js'];
    const globals = { react: 'React', 'react-dom': 'ReactDOM', '@lyrical/js': 'lyricalJs' };

    if (config.unpkg) {
      const umdRollup = new LoughRollup({
        input: 'src/index.umd.ts',
        plugins: [
          styles({
            mode: 'extract',
            less: { javascriptEnabled: true },
            extensions: ['.styl', '.css'],
            minimize: false,
            use: ['stylus'],
            url: {
              inline: true
            },
            plugins: [autoprefixer()]
          }),
          ...commonPlugins
        ],
        external,
        output: [
          {
            format: 'umd',
            name: 'lyricalReact',
            globals,
            assetFileNames: '[name].[ext]',
            file: 'dist/index.js',
            banner
          }
        ]
      });

      umdRollup.build();

      const unpkgRollup = new LoughRollup({
        input: 'src/index.umd.ts',
        plugins: [
          styles({
            mode: 'extract',
            less: { javascriptEnabled: true },
            extensions: ['.styl', '.css'],
            minimize: true,
            use: ['stylus'],
            url: {
              inline: true
            },
            plugins: [autoprefixer()]
          }),
          ...commonPlugins
        ],
        external,
        output: [
          {
            format: 'umd',
            name: 'lyricalReact',
            globals,
            assetFileNames: '[name].[ext]',
            file: 'dist/index.min.js',
            plugins: [terser()],
            banner
          }
        ]
      });

      unpkgRollup.build();
    }

    if (config.main) {
      //
    }

    if (config.module) {
      //
    }

    // if (config.types) {
    //   //
    // }
  });

  program.parseAsync(process.argv);
}

start();
