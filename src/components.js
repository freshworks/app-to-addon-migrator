const inquirer = require('inquirer');
const command = require('./commands/component');
const fuzzy = require('fuzzy');
const walkSync = require('walk-sync');
const searchDest = require('./utils/search-dest');

module.exports.moveComponent = function () {
  const _components = walkSync('app/components', { directories: false });
  const components = _components
    .filter((c) => !c.includes('template.hbs'))
    .map((c) => c.replace('/component.js', ''));

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
  function searchComponents(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, components);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const componentPrompt = [
    {
      type: 'autocomplete',
      name: 'componentName',
      message: 'Enter the component name:',
      source: searchComponents,
    },
    {
      type: 'autocomplete',
      name: 'destination',
      message: 'Enter the destination addon path:',
      source: searchDest,
    },
    {
      type: 'confirm',
      name: 'dryRun',
      message: 'Dry Run? (default: yes)',
      default: true,
    },
  ];

  inquirer.prompt(componentPrompt).then((answers) => {
    const { componentName, destination, dryRun } = answers;
    command.handler({
      componentName,
      destination,
      dryRun,
      pods: true,
    });
  });
};
