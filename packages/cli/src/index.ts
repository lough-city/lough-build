#!/usr/bin/env node
import { program } from 'commander';
import { join } from 'path';
import { readFileSync } from 'fs';
import init from './commands/init';
import build from './commands/build';
import dev from './commands/dev';
import external from './commands/external';
import { LoughBuildConfig } from './typings/config';

function start() {
  const jsonPath = join(__dirname, '../package.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  const jsonResult = JSON.parse(jsonContent);
  program.version(jsonResult.version);

  program.command(init.command).description(init.description).action(init.action);
  program.command(external.command).description(external.description).action(external.action);

  program.description(build.description).action(build.action);

  program.command(dev.command).description(dev.description).action(dev.action);

  program.parseAsync(process.argv);
}

start();

export const defineConfig = (config: Partial<LoughBuildConfig>) => config;
