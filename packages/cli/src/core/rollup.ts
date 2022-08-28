import { OutputOptions, /* Plugin,  */ rollup, RollupOptions } from 'rollup';
import { RollupInputOptions } from './inputOptions';
import { RollupOutputOptions } from './outputOptions';

type IOptions = RollupOptions & { output: Array<OutputOptions> };

const originBuild = async (options: IOptions) => {
  let bundle;
  let buildFailed = false;

  try {
    bundle = await rollup({ ...options, output: undefined });
    for (const outputOptions of options.output) {
      const result = await bundle.write(outputOptions);
    }
  } catch (error) {
    buildFailed = true;
    // do some error reporting
    console.error(error);
  }
  if (bundle) {
    // closes the bundle
    await bundle.close();
  }

  return !buildFailed;
};

export class LoughRollup {
  inputOption = new RollupInputOptions();

  outputOption = new RollupOutputOptions();

  build() {
    return originBuild({ ...this.inputOption.options, output: [this.outputOption.options] });
  }
}
