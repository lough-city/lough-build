import { Plugin, RollupOptions, ExternalOption, OutputPlugin } from 'rollup';
import styles from 'rollup-plugin-styles';
import autoprefixer from 'autoprefixer';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript, { RPT2Options } from 'rollup-plugin-typescript2';
import { writeFileSync, existsSync } from 'fs';
import { join, resolve as pathResolve } from 'path';

export class RollupInputOptions {
  options: RollupOptions = {};

  private addPlugin(plugin: Plugin) {
    if (!this.options.plugins) this.options.plugins = [];
    this.options.plugins.push(plugin);
  }

  switch(use: boolean, callback: (self: RollupInputOptions) => void) {
    if (use) callback(this);
    return this;
  }

  input(input: string | Array<string>) {
    this.options.input = input;
    return this;
  }

  external(external: ExternalOption) {
    this.options.external = external;
    return this;
  }

  style(options: { minimize?: boolean; split?: boolean } = {}) {
    const { minimize = false, split = false } = options;

    const dtsList: Array<string> = [];

    if (split)
      this.addPlugin({
        name: 'lough-build-style',
        transform(code, id) {
          if (!id.includes(join('style', 'index.tsx'))) return null;
          return {
            code: `${code}
export const str = 'WAIT_REPLACE'`
          };
        },
        renderChunk(code, chunk, options) {
          if (!chunk.fileName.includes('style/index.js')) return code;
          if (!chunk.isEntry) return code;
          return `import './index.css';`;
        },
        writeBundle(option, bundle) {
          for (const key of Object.keys(bundle).filter(key => key.includes('style/index.d.ts'))) {
            const item = bundle[key];
            dtsList.push(pathResolve(process.cwd(), option.dir || '', item.fileName));
          }
        },
        closeBundle() {
          for (const dtsFileName of dtsList) {
            if (!existsSync(dtsFileName)) continue;

            writeFileSync(dtsFileName, `import './index.css';`, { encoding: 'utf-8' });
          }
        }
      });

    this.addPlugin(
      styles({
        mode: 'extract',
        less: { javascriptEnabled: true },
        minimize,
        url: {
          inline: true
        },
        plugins: [autoprefixer()]
      })
    );

    return this;
  }

  typescript(params: RPT2Options & Record<string, any>) {
    this.addPlugin(typescript(params));
    return this;
  }

  image() {
    this.addPlugin(image());
    return this;
  }

  resolve() {
    this.addPlugin(resolve({ extensions: ['.ts', '.tsx'] }));
    return this;
  }

  babel() {
    this.addPlugin(
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        extensions: ['.ts', '.tsx'],
        skipPreflightCheck: true,
        presets: ['@babel/preset-react', '@babel/preset-typescript']
      })
    );
    return this;
  }

  commonjs() {
    this.addPlugin(commonjs());
    return this;
  }
}
