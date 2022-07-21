import { OutputOptions, Plugin, RollupOptions, ExternalOption, OutputPlugin } from 'rollup';
import styles from 'rollup-plugin-styles';
import autoprefixer from 'autoprefixer';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export class RollupInputOptions {
  options: RollupOptions = {};

  private addPlugin(plugin: Plugin) {
    if (!this.options.plugins) this.options.plugins = [];
    this.options.plugins.push(plugin);
  }

  input(input: string | Array<string>) {
    this.options.input = input;
    return this;
  }

  external(external: ExternalOption) {
    this.options.external = external;
    return this;
  }

  style(options: { minimize?: boolean } = {}) {
    const { minimize = false } = options;

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

enum FORMAT_TYPE {
  umd = 'umd',
  es = 'es',
  cjs = 'cjs'
}

export class RollupOutputOptions {
  options: OutputOptions = {};

  private addPlugin(plugin: OutputPlugin) {
    if (!this.options.plugins) this.options.plugins = [];
    this.options.plugins.push(plugin);
  }

  format(map: (map: typeof FORMAT_TYPE) => FORMAT_TYPE) {
    this.options.format = map(FORMAT_TYPE);
    return this;
  }

  name(name: string) {
    this.options.name = name;
    return this;
  }

  globals(globals: Record<string, string>) {
    this.options.globals = globals;
    return this;
  }

  assetFileNames(assetFileNames = '[name].[ext]') {
    this.options.assetFileNames = assetFileNames;
    return this;
  }

  file(file: string) {
    this.options.file = file;
    return this;
  }

  banner(banner: string) {
    this.options.banner = banner;
    return this;
  }

  terser() {
    this.addPlugin(terser());
    return this;
  }
}
