import { OutputOptions, OutputPlugin } from 'rollup';
import { terser } from 'rollup-plugin-terser';

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

  format(map: (map: typeof FORMAT_TYPE) => FORMAT_TYPE, dir?: string) {
    this.options.format = map(FORMAT_TYPE);
    if (dir) {
      this.options.dir = dir;
      return this;
    }

    if (this.options.format === FORMAT_TYPE.es) this.options.dir = 'es';
    if (this.options.format === FORMAT_TYPE.cjs) this.options.dir = 'lib';

    return this;
  }

  preserveModules(root = 'src') {
    this.options.preserveModules = true;
    this.options.preserveModulesRoot = root;
    return this;
  }

  exports(exports: OutputOptions['exports'] = 'named') {
    this.options.exports = exports;
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

  assetFileNames(assetFileNames: OutputOptions['assetFileNames'] = '[name].[ext]') {
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
