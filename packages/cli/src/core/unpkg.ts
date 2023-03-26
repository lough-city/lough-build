import { existsSync } from 'fs';
import { join } from 'path';
import { GenerateConfig } from '../typings/config';
import { LoughRollup } from './rollup';

export const generateUnpkg = ({ input, globals, external, style, title, banner, config, rootPath }: GenerateConfig) => {
  const flow = new LoughRollup();

  flow.inputOption
    .input(existsSync(join(rootPath, input.replace('.ts', '.umd.ts'))) ? input.replace('.ts', '.umd.ts') : input)
    .shebang()
    .external(external)
    .switch(style, self => self.style({ minimize: true }))
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
    .file(config.unpkg ?? 'dist/index.min.js')
    .banner(banner)
    .terser();

  return flow.build();
};
