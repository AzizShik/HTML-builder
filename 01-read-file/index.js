const fs = require('fs');
const path = require('path');

const textFilePath = path.join(__dirname, 'text.txt');

const textReaderStream = fs.createReadStream(textFilePath, {
  encoding: 'utf-8',
});

textReaderStream.on('data', (chunk) => {
  const canContinue = process.stdout.write(chunk);

  if (!canContinue && !textReaderStream.isPaused()) {
    textReaderStream.pause();
    process.stdout.once('drain', () => {
      textReaderStream.resume();
    });
  }
});
