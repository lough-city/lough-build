import { existsSync } from 'fs';
import { join } from 'path';
import { GenerateConfig } from '../typings/config';
import { LoughRollup } from './rollup';

export const generateUnpkg = ({ input, globals, external, style, title, banner, config, rootPath }: GenerateConfig) => {
  const flow = new LoughRollup();

  flow.inputOption
    .input(
      input.map(item =>
        existsSync(join(rootPath, item.replace('.ts', '.umd.ts'))) ? item.replace('.ts', '.umd.ts') : item
      )
    )
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
