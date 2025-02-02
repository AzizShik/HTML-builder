const path = require('path');
const { stdin, stdout } = require('process');
const fs = require('fs');

const filePath = path.join(__dirname, 'newText.txt');

const writeStream = fs.createWriteStream(filePath, 'utf-8');

stdout.write('Hello! Write your text to the created file. \n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writeStream.write(data);
  }
});

process.on('exit', () => {
  stdout.write('Goodbye! Check created file.');
});

process.on('SIGNT', () => {
  process.exit();
});
