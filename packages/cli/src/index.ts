#!/usr/bin/env node
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Package } from '@lough/npm-operate';
import { program } from 'commander';
import build from './commands/build';
import dev from './commands/dev';
import external from './commands/external';
import init from './commands/init';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function start() {
  const npm = new Package({ dirName: join(__dirname, '..') });
  program.version(npm.version);

  program.command(init.command).description(init.description).action(init.action);
  program.command(external.command).description(external.description).action(external.action);

  program.description(build.description).action(build.action);

  program.command(dev.command).description(dev.description).action(dev.action);

  program.parseAsync(process.argv);
}

start();

export * from './utils/defineConfig';
