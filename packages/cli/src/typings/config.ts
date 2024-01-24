import { IPackage } from '@lough/npm-operate';

export interface LoughBuildConfig {
  input: string | Array<string>;
  external: Array<string>;
  globals: Record<string, string>;
  terser: boolean;
  style: boolean;
  componentDir: string;
}

export interface GenerateConfig extends LoughBuildConfig {
  input: Array<string>;
  styleDirList: Array<string>;
  config: IPackage;
  title: string;
  banner: string;
  rootPath: string;
}
