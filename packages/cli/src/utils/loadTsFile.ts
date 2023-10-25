import vm from 'vm';
import { rollup } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import { defineConfig } from '..';

export async function loadTsFileRuntime(tsFilePath: string) {
  // 创建 Rollup 输入选项
  const inputOptions = {
    input: tsFilePath,
    plugins: [typescript({ tsconfigOverride: { compilerOptions: { target: 'ES2015', module: 'es2015' } } })],
    external: ['@lough/build-cli']
  };

  // 使用 Rollup API 编译 TypeScript 文件
  const bundle = await rollup(inputOptions);
  const { output } = await bundle.generate({
    format: 'cjs',
    exports: 'named' as const
  });

  // 使用 Node.js 的 VM 模块来执行编译后的代码并获取导出的配置
  const sandbox = {
    module: { exports: {} },
    exports: {},
    require: (moduleName: string) => {
      if (moduleName === '@lough/build-cli') {
        return { defineConfig };
      }
      throw new Error(`Cannot find module: ${moduleName}`);
    },
    console: console
  };

  const context = vm.createContext(sandbox);
  const exported = vm.runInContext(output[0].code, context);

  return exported;
}
