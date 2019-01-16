module.exports = {
  linters: {
    'src/app/**/*.{ts,tsx}': ['tslint -c ./tslint.js --fix', 'git add'],
    'src/css/**/*.css': ['stylelint --fix', 'git add'],
  },
};
