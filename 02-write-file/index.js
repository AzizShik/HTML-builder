const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fileName = 'file.txt';

const writableStream = fs.createWriteStream(path.join(__dirname, fileName));

process.stdout.write('Welcome! Write your text. \n');

// process.stdin.on('data', (data) => {
//   if (data.toString().trim() === 'exit') {
//     process.stdout.write('Goodbye!');
//     writableStream.end();
//     process.exit();
//     return;
//   }

//   writableStream.write(data);
// });

// process.on('SIGINT', () => {
//   process.stdout.write('Goodbye!');
//   process.exit();
// });

/////////////////////////////////////

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (data) => {
  const dataStr = data.toString();

  if (dataStr.trim() === 'exit') {
    rl.close();
    return;
  }

  writableStream.write(dataStr + '\n');
});

rl.on('close', () => {
  writableStream.end();
  process.stdout.write('Goodbye!');
});
