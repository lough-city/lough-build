import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import hashbang from 'rollup-plugin-hashbang';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts', // 指定入口文件
  external: [
    '@babel/core',
    '@babel/preset-react',
    '@babel/preset-typescript',
    '@lough/npm-operate',
    '@rollup/plugin-babel',
    '@rollup/plugin-commonjs',
    '@rollup/plugin-image',
    '@rollup/plugin-json',
    '@rollup/plugin-node-resolve',
    'autoprefixer',
    'bundle-require',
    'chalk',
    'chokidar',
    'commander',
    'esbuild',
    'execa',
    'inquirer',
    'ora',
    'rollup',
    'rollup-plugin-hashbang',
    'rollup-plugin-styles',
    'rollup-plugin-terser',
    'rollup-plugin-typescript2'
  ],
  output: {
    format: 'es',
    dir: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: [
    hashbang(),
    typescript({ jsx: 'preserve', check: false, tsconfigOverride: { noEmit: true } }),
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      extensions: ['.ts'],
      skipPreflightCheck: true,
      presets: ['@babel/preset-typescript']
    })
  ]
};
