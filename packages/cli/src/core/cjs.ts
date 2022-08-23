import { parse, join } from 'path';
import { LoughRollup } from './rollup';
import { GenerateConfig } from '../typings/config';

export const generateCommonJS = ({ input, globals, external, style, styleDirList, config }: GenerateConfig) => {
  const flow = new LoughRollup();

  flow.inputOption
    .input([input, ...styleDirList])
    .external(external)
    .switch(style, self => self.style({ split: true }))
    .image()
    .resolve()
    .babel()
    .commonjs()
    .switch(!!config.types, self =>
      self.typescript({ jsx: 'preserve', check: false, tsconfigOverride: { noEmit: true } })
    );

  flow.outputOption
    .format(map => map.cjs)
    .preserveModules()
    .globals(globals)
    .exports()
    .assetFileNames(({ name }) => {
      const { ext, dir, base } = parse(name as string);

      if (ext !== '.css') return '[name].[ext]';
      return join(dir, base);
    });

  return flow.build();
};
