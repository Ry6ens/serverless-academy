import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

rl.on('line', async input => {
  const answerFirst = await rl.question(
    'Hello. Enter 10 words or digits deviding them in space: '
  );

  const lengthAnswer = answerFirst
    .trim()
    .split(' ')
    .filter(el => el !== '').length;

  // Check on empty string or less two words or digits
  if (lengthAnswer < 2) {
    console.log('Please enter more than 2 words or digits');
    return;
  }

  const answerSecond = await rl.question(
    'What operation to do with words and numbers, namely: \n a. Sort words alphabetically \n b. Show numbers from lesser to greater \n c. Show numbers from bigger to smaller \n d. Display words in ascending order by number of letters in the word. \n e. Show only unique words \n f. Display only unique values from the set of words and numbers entered by the user \n g. To exit the program, the user need to enter exit, otherwise the program will repeat itself again and again, asking for new data and suggesting sorting \n \n Selected operation: '
  );

  const arrayWords = answerFirst.replace(/\d+/g, '').toLowerCase().split(' ');
  const arrayNumbers = answerFirst.replace(/[^0-9\.]+/g, ' ').split(' ');
  const arrayAll = answerFirst.split(' ');

  switch (answerSecond) {
    case 'a':
      const resultA = arrayWords.sort();

      console.log('\nResult: ', resultA.join(' '));
      break;
    case 'b':
      const resultB = arrayNumbers.sort();

      console.log('\nResult: ', resultB.join(' '));
      break;
    case 'c':
      const resultC = arrayNumbers.sort((a, b) => b - a);

      console.log('\nResult: ', resultC.join(' '));
      break;
    case 'd':
      const resultD = arrayWords.sort((a, b) => a.length - b.length);

      console.log('\nResult: ', resultD.join(' '));
      break;
    case 'e':
      const resultE = [];
      for (let i = 0; i < arrayWords.length; i++) {
        let word = arrayWords[i];

        if (arrayWords.indexOf(word) === arrayWords.lastIndexOf(word)) {
          resultE.push(word);
        }
      }

      console.log('\nResult: ', resultE.join(' '));
      break;
    case 'f':
      const resultF = [];
      for (let i = 0; i < arrayAll.length; i++) {
        let word = arrayAll[i];

        if (arrayAll.indexOf(word) === arrayAll.lastIndexOf(word)) {
          resultF.push(word);
        }
      }

      console.log('\nResult: ', resultF.join(' '));
      break;
    case 'exit':
      rl.close();
      break;
    default:
      console.log('\nYou should to choose operation');
  }
});
