import { existsSync } from 'fs';
import { join } from 'path';
import { GenerateConfig } from '../typings/config';
import { LoughRollup } from './rollup';

export const generateUmd = ({
  input,
  globals,
  external,
  style,
  terser,
  title,
  banner,
  config,
  rootPath
}: GenerateConfig) => {
  const flow = new LoughRollup();

  const file = config.unpkg?.replace?.('.min', '') ?? 'dist/index.js';

  flow.inputOption
    .input(existsSync(join(rootPath, input.replace('.ts', '.umd.ts'))) ? input.replace('.ts', '.umd.ts') : input)
    .shebang()
    .external(external)
    .switch(style, self => self.style())
    .image()
    .json()
    .resolve()
    .babel()
    .commonjs();

  flow.outputOption
    .format(map => map.umd)
    .name(title)
    .globals(globals)
    .assetFileNames()
    .file(file)
    .banner(banner)
    .switch(terser, self => self.terser());

  return flow.build();
};
