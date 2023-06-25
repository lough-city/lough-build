import { parse, join } from 'path';
import { GenerateConfig } from '../typings/config';
import { LoughRollup } from './rollup';

export const generateESModule = ({ input, external, terser, style, styleDirList, config }: GenerateConfig) => {
  const flow = new LoughRollup();

  flow.inputOption
    .input([input, ...styleDirList])
    .shebang()
    .switch(!!config.types, self =>
      self.typescript({ jsx: 'preserve', check: false, tsconfigOverride: { noEmit: true } })
    )
    .external(external)
    .switch(style, self => self.style({ split: true }))
    .image()
    .json()
    .resolve()
    .babel()
    .commonjs();

  flow.outputOption
    .format(map => map.es)
    .preserveModules()
    .exports()
    .assetFileNames(({ name }) => {
      const { ext, dir, base } = parse(name as string);
      if (ext !== '.css') return '[name].[ext]';
      return join(dir, base);
    })
    .switch(terser, self => self.terser());

  return flow.build();
};
