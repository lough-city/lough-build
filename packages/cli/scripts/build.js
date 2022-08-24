const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const files = fs.readdirSync(path.join(__dirname, '../src/templates'));

fs.mkdirSync(path.join(__dirname, '../bin/templates'));

for (f of files) {
  fs.copyFileSync(path.join(__dirname, '../src/templates/') + f, path.join(__dirname, '../bin/templates/') + f);
}

console.log(chalk.green('打包成功！'));
