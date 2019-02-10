'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const dateformat = require('dateformat');
const gitP = require('simple-git/promise');
const util = require('util');

const ADD_README = 'addreadme';
const ADD_GIT = 'addgit';

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the badass ${chalk.yellow('generator-ice40')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname
      },
      {
        type: 'list',
        name: 'memory',
        message: 'Memory size',
        choices: [
          {
            name: "8 kB",
            value: "8k"
          },
          {
            name: "4 kB",
            value: "4k"
          },
          {
            name: "1 kB",
            value: "1k"
          }]
      },
      {
        type: 'input',
        name: 'username',
        message: 'Your Username',
        store: true
      },
      {
        type: 'input',
        name: 'email',
        message: 'Your email',
        store: true
      },
      {
        type: 'checkbox',
        name: 'options',
        message: 'What more would you like?',
        choices: [
          {
            name: 'Add README.md',
            value: ADD_README,
            checked: false
          },
          {
            name: 'Add git',
            value: ADD_GIT,
            checked: false
          }]
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {

    let now = new Date();
    let strDate = dateformat(now, 'yyyy/dd/mm hh:MM:ss');
    var fileTokens = {
      projectName: this.props.projectName,
      email: this.props.email,
      username: this.props.username,
      datetime: strDate,
      memory: this.props.memory
    };

    this.fs.copyTpl(
      this.templatePath('ice40-template/Makefile'),
      this.destinationPath(this.props.projectName + '/Makefile'),
      fileTokens
    );

    this.fs.copyTpl(
      this.templatePath('ice40-template/__PROJECT-NAME__.pcf'),
      this.destinationPath(this.props.projectName + '/' + this.props.projectName + '.pcf'),
      fileTokens
    );

    this.fs.copyTpl(
      this.templatePath('ice40-template/__PROJECT-NAME__.v'),
      this.destinationPath(this.props.projectName + '/' + this.props.projectName + '.v'),
      fileTokens
    );

    this.fs.copyTpl(
      this.templatePath('ice40-template/__PROJECT-NAME___tb.v'),
      this.destinationPath(this.props.projectName + '/' + this.props.projectName + '_tb.v'),
      fileTokens
    );

    if (this.props.options.includes(ADD_README)) {
      this.fs.copyTpl(
        this.templatePath('ice40-template/README.md'),
        this.destinationPath(this.props.projectName + '/README.md'),
        fileTokens
      );
    }

    if (this.props.options.includes(ADD_GIT)) {
      this.fs.copyTpl(
        this.templatePath('ice40-template/.gitignore'),
        this.destinationPath(this.props.projectName + '/.gitignore'),
        fileTokens
      );
    }

  }

  install() {
    // this.installDependencies();    
    
    if (this.props.options.includes(ADD_GIT)) {
      const git = gitP('./' + this.props.projectName + '/');
      git.checkIsRepo()
        .then(isRepo => !isRepo && git.init());
      
      var message = util.format('      %s %s',chalk.green('git'), 'initialise');
      this.log(message);
    }

  }

};
