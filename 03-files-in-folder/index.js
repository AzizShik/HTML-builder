const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const sourceDir = path.join(__dirname, 'secret-folder');

fs.readdir(sourceDir, { withFileTypes: true }, (err, stats) => {
  if (err) throw err;

  stats.forEach((file) => {
    if (!file.isDirectory()) {
      const filePath = path.join(file.path, file.name);

      fs.stat(filePath, (err, info) => {
        if (err) throw err;

        const fileName = path.parse(file.name).name;
        const extName = path.parse(file.name).ext.replace('.', '');
        const fileSize = info.size * 0.001 + 'kb';

        stdout.write(`${fileName} - ${extName} - ${fileSize} \n`);
      });
    }
  });
});
