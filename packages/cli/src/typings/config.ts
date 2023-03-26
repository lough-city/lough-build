import { IPackage } from '@lough/npm-operate';

export interface LoughBuildConfig {
  input: string;
  external: true | Array<string>;
  globals: true | Record<string, string>;
  style: boolean;
  componentDir: string;
}

export interface GenerateConfig extends LoughBuildConfig {
  styleDirList: Array<string>;
  config: IPackage;
  title: string;
  banner: string;
  rootPath: string;
}
