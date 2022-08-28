import { parse, join } from 'path';
import { LoughRollup } from './rollup';
import { GenerateConfig } from '../typings/config';
import { removeDirOrFileSync } from '../utils/file';

export const generateESModule = ({
  input,
  globals,
  external,
  style,
  styleDirList,
  config,
  rootPath
}: GenerateConfig) => {
  const flow = new LoughRollup();

  flow.inputOption
    .input([input, ...styleDirList])
    .switch(!!config.types, self =>
      self.typescript({ jsx: 'preserve', check: false, tsconfigOverride: { noEmit: true } })
    )
    .external(external)
    .switch(style, self => self.style({ split: true }))
    .image()
    .resolve()
    .babel()
    .commonjs();

  flow.outputOption
    .format(map => map.es)
    .preserveModules()
    .globals(globals)
    .exports()
    .assetFileNames(({ name }) => {
      const { ext, dir, base } = parse(name as string);
      if (ext !== '.css') return '[name].[ext]';
      return join(dir, base);
    });

  removeDirOrFileSync(join(rootPath, 'es'));

  return flow.build();
};
