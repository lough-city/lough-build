import { IPackage } from '@lough/npm-operate';

export interface LoughBuildConfig {
  input: string;
  external: Array<string>;
  globals: Record<string, string>;
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
