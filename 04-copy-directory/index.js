const path = require('path');
const fs = require('fs');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

fs.mkdir(targetDir, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(sourceDir, (err, stats) => {
  if (err) throw err;

  stats.forEach((fileName) => {
    const fileSource = path.join(sourceDir, fileName);
    const targetSource = path.join(targetDir, fileName);

    fs.copyFile(fileSource, targetSource, (err) => {
      if (err) throw err;
    });
  });

  fs.readdir(targetDir, (err, targetFiles) => {
    if (err) throw err;

    targetFiles.forEach((targetFile) => {
      if (!stats.includes(targetFile)) {
        const targetFilePath = path.join(targetDir, targetFile);

        fs.unlink(targetFilePath, (err) => {
          if (err) throw err;
        });
      }
    });
  });
});
