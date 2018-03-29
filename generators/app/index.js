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
    name: 'projectName',
    type: 'input',
    message: 'Project name:',
    validate: function(input) {
      if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
      return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  },
  {
    name: 'description',
    type: 'input',
    message: 'Project description',
    default: ''
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
  }
];

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the marvelous ${chalk.red('js-project-generator')}!`));

    return this.prompt(QUESTIONS).then(answers => {
      this.answers = answers;

      const { projectChoice, projectName } = answers;
      const templatePath = `${__dirname}/templates/${projectChoice}`;
      const projectDir = `${CURR_DIR}/${projectName}`;

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
      {
        projectName: this.answers.projectName,
        description: this.answers.description
      }
    );
    this.fs.copyTpl(
      this.templatePath(`${this.answers.templatePath}/_index.html`),
      this.destinationPath(`${this.answers.projectDir}/index.html`),
      {
        projectName: this.answers.projectName
      }
    );
    this.fs.copy(
      this.templatePath(`${this.answers.templatePath}/_lib/bootstrap.min.css`),
      this.destinationPath(`${this.answers.projectDir}/lib/bootstrap.min.css`),
      {
        projectName: this.answers.projectName
      }
    );
    this.fs.copy(
      this.templatePath(`${this.answers.templatePath}/_lib/jquery-1.9.1.js`),
      this.destinationPath(`${this.answers.projectDir}/lib/jquery-1.9.1.js`),
      {
        projectName: this.answers.projectName
      }
    );
    this.fs.copyTpl(
      this.templatePath(`${this.answers.templatePath}/_src/_js/_index.js`),
      this.destinationPath(`${this.answers.projectDir}/src/js/index.js`),
      {
        projectName: this.answers.projectName,
        description: this.answers.description,
        email: this.answers.email,
        company: this.answers.company,
        author: this.answers.author
      }
    );
  }

  install() {
    // This.installDependencies();
  }
};
