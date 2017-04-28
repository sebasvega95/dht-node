const chalk = require('chalk');

exports.error = (...args) => {
  console.log(chalk.red('error'), ...args);
};

exports.info = (...args) => {
  console.log(chalk.blue('info '), ...args);
};

exports.warn = (...args) => {
  console.log(chalk.yellow('warn '), ...args);
};
