'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');
const CURR_DIR = process.cwd();

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: 'projectChoice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES
  },
  {
    name: 'name',
    type: 'input',
    message: 'Project name:',
    default: this.appname, // Default to current folder name
    validate: function(input) {
      if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
      return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  },
  {
    name: 'description',
    type: 'input',
    message: 'Project description',
    default: 'A jquery plugin'
  },
  {
    name: 'version',
    type: 'input',
    message: 'Current version',
    default: '0.0.0'
  },
  {
    name: 'author',
    type: 'input',
    message: 'Author',
    default: ''
  },
  {
    name: 'email',
    type: 'input',
    message: 'Email',
    default: ''
  },
  {
    name: 'company',
    type: 'input',
    message: 'Company',
    default: ''
  },
  {
    name: 'website',
    type: 'input',
    message: 'Website',
    default: ''
  }
];

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the marvelous ${chalk.red('js-project-generator')}!`));

    return this.prompt(QUESTIONS).then(answers => {
      this.answers = answers;

      const { projectChoice, name } = answers;
      const templatePath = `${__dirname}/templates/${projectChoice}`;
      const projectDir = `${CURR_DIR}/${name}`;

      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir);
      }

      Object.assign(this.answers, {
        templatePath,
        projectDir
      });
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(`${this.answers.templatePath}/_README.md`),
      this.destinationPath(`${this.answers.projectDir}/README.md`),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath(`${this.answers.templatePath}/_index.html`),
      this.destinationPath(`${this.answers.projectDir}/index.html`),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath(`${this.answers.templatePath}/_src/_js/_index.js`),
      this.destinationPath(`${this.answers.projectDir}/src/js/index.js`),
      this.answers
    );
  }

  install() {
    // This.installDependencies();
  }
};
