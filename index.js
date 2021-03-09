#! /usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const execa = require('execa');
const Listr = require('Listr');
const inquirer = require('inquirer');

let directoryName = ''

const questions = [
    {
        type: 'input',
        name: 'directory',
        message: 'Enter your directory',
        validate: (value) =>
            value?.trim().length > 0 ? true : 'Please enter a valid directory',
    }
];

const tasks = new Listr([
    {
        title: 'Preparing to install ...',
        task: () => {
            return new Listr([
                {
                    title: 'Installing docker php containers',
                    task: async (context, task) => {
                        directoryName = context.directory
                        const url = 'git@github.com:rossque/docker-php.git'
                        const params = ['clone', url, context.directory];
                        await execa('git', [...params]);
                    },
                },
            ]);

        },
    },
    {
        title: 'Housekeeping ...',
        task: () => {
            return new Listr([
                {
                    title: 'Removing unused directories',
                    task: async (context, task) => {
                        const params = ['-rf', context.directory + '/.git'];
                        await execa('rm', [...params]);
                    },
                },
            ]);

        },
    }
]);


function showConfig () {

    console.log('\n# Build containers')
    console.log('cd ' + directoryName + ' && npm install && npm run up\n')

}

inquirer.prompt(questions)
    .then((answers) => {
        tasks.run(answers)
            .then((response) => showConfig())
            .catch((err) => console.log(err));
    }
    )


//process.exit(1)
