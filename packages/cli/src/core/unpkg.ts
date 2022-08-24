import { existsSync } from 'fs';
import { join } from 'path';
import { LoughRollup } from './rollup';
import { GenerateConfig } from '../typings/config';

export const generateUnpkg = ({ input, globals, external, style, title, banner, config, rootPath }: GenerateConfig) => {
  const flow = new LoughRollup();

  flow.inputOption
    .input(existsSync(join(rootPath, input.replace('.ts', '.umd.ts'))) ? input.replace('.ts', '.umd.ts') : input)
    .external(external)
    .switch(style, self => self.style({ minimize: true }))
    .image()
    .resolve()
    .babel()
    .commonjs();

  flow.outputOption
    .format(map => map.umd)
    .name(title)
    .globals(globals)
    .assetFileNames()
    .file(config.unpkg ?? 'dist/index.min.js')
    .banner(banner)
    .terser();

  return flow.build();
};
