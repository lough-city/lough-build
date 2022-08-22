export interface LoughBuildConfig {
  input: string;
  external: Array<string>;
  globals: Record<string, string>;
  style: boolean;
}
