import { readdirSync, mkdirSync, copyFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = readdirSync(join(__dirname, '../src/templates'));

mkdirSync(join(__dirname, '../bin/templates'));

for (const f of files) {
  copyFileSync(join(__dirname, '../src/templates/') + f, join(__dirname, '../bin/templates/') + f);
}

console.log(chalk.green('打包成功！'));
