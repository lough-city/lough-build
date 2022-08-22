import { OutputOptions, /* Plugin,  */ rollup, RollupOptions } from 'rollup';

type IOptions = RollupOptions & { output: Array<OutputOptions> };

const originBuild = async (options: IOptions) => {
  let bundle;
  let buildFailed = false;

  try {
    bundle = await rollup({ ...options, output: undefined });

    for (const outputOptions of options.output) {
      await bundle.write(outputOptions);
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
  process.exit(buildFailed ? 1 : 0);
};

export default class LoughRollup {
  private options: IOptions;

  constructor(options: IOptions) {
    this.options = options;
  }

  // addInputPlugin(plugin: Plugin) {
  //   if (!this.options.plugins) {
  //     this.options.plugins = [plugin];
  //     return this;
  //   }

  //   this.options.plugins.push(plugin);
  //   return this;
  // }

  addOutputOption(outputOptions: OutputOptions) {
    if (!this.options.output) {
      this.options.output = [outputOptions];
      return this;
    }

    this.options.output.push(outputOptions);
    return this;
  }

  build() {
    originBuild(this.options);
  }
}
