import { defineConfig } from '@lough/build-cli';

export default defineConfig({
  external: [],
  globals: {},
  terser: false,
  style: true,
  input: 'src/index.ts'
});
