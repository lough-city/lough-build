import { parse, join } from 'path';
import { LoughRollup } from './rollup';
import { GenerateConfig } from '../typings/config';
import { removeDirOrFileSync } from '../utils/file';

export const generateCommonJS = ({
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
    .format(map => map.cjs)
    .preserveModules()
    .globals(globals)
    .exports()
    .assetFileNames(({ name }) => {
      const { ext, dir, base } = parse(name as string);

      if (ext !== '.css') return '[name].[ext]';
      return join(dir, base);
    });

  // removeDirOrFileSync(join(rootPath, 'lib'));

  return flow.build();
};
