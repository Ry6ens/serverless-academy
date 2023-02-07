const inquirer = require('inquirer');
const fs = require('fs');

const questions = [
  {
    type: 'input',
    name: 'user',
    message: 'Enter the user name. To cancel press ENTER:',
  },
  {
    type: 'list',
    name: 'gender',
    message: 'Choose your Gender:',
    choices: ['male', 'female'],
    when: answers => {
      if (answers.user === '') {
        return false;
      }
      return true;
    },
  },
  {
    type: 'string',
    name: 'age',
    message: 'Enter your Age:',
    when: answers => {
      if (answers.user === '') {
        return false;
      }
      return true;
    },
  },
];

const searchQuestion = [
  {
    type: 'confirm',
    name: 'search',
    message: 'Would you to search value in DB?',
  },
];

const findUserQuestion = [
  {
    type: 'input',
    name: 'findUser',
    message: 'Enter user name you wanna find in DB?',
  },
];

function getUser() {
  inquirer.prompt(questions).then(answers => {
    if (answers.user === '') {
      serchValue();
      return;
    }

    const writableStream = fs.createWriteStream('./users.txt', { flag: 'a' });
    const file = fs.readFileSync('./users.txt', { encoding: 'utf8' });

    if (!file.length) {
      const array = [];
      array.push({ ...answers, id: Math.floor(Math.random() * 99999).toString() });
      writableStream.write(JSON.stringify(array));
      getUser();
      return;
    }

    const fileParse = JSON.parse(file);
    fileParse.push({ ...answers, id: Math.floor(Math.random() * 99999).toString() });
    writableStream.write(JSON.stringify(fileParse));
    getUser();
  });
}

function serchValue() {
  inquirer.prompt(searchQuestion).then(answers => {
    if (!answers.search) {
      return;
    }

    const file = fs.readFileSync('./users.txt', { encoding: 'utf8' });
    console.log(JSON.parse(file));

    findUser();
  });
  return;
}

function findUser() {
  inquirer.prompt(findUserQuestion).then(answers => {
    const file = fs.readFileSync('./users.txt', { encoding: 'utf8' });
    const array = JSON.parse(file);
    const user = array.find(
      el => el.user.toLowerCase() === answers.findUser.toLowerCase()
    );
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log(`User ${user.user} was found`);
    console.log(user);
  });
  return;
}

getUser();
