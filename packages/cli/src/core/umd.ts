import { existsSync } from 'fs';
import { join } from 'path';
import { LoughRollup } from './rollup';
import { GenerateConfig } from '../typings/config';

export const generateUmd = ({ input, globals, external, style, title, banner, config }: GenerateConfig) => {
  const flow = new LoughRollup();

  flow.inputOption
    .input(existsSync(join(process.cwd(), input.replace('.ts', '.umd.ts'))) ? input.replace('.ts', '.umd.ts') : input)
    .external(external)
    .switch(style, self => self.style())
    .image()
    .resolve()
    .babel()
    .commonjs();

  flow.outputOption
    .format(map => map.umd)
    .name(title)
    .globals(globals)
    .assetFileNames()
    .file(config.unpkg?.replace?.('.min', '') ?? 'dist/index.js')
    .banner(banner);

  return flow.build();
};
