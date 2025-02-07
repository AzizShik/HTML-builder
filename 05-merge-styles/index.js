const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'styles');
const targetPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(targetPath, 'bundle.css');

const bundleFile = fs.writeFile(bundlePath, '', (err) => {
  if (err) throw err;
});

const bundleInput = fs.createWriteStream(bundlePath);

fs.readdir(sourcePath, { withFileTypes: true }, (err, stats) => {
  if (err) throw err;

  stats.forEach((dirent) => {
    const filePath = path.join(dirent.path, dirent.name);
    const fileExt = path.parse(dirent.name).ext;

    if (!dirent.isDirectory() && fileExt === '.css') {
      const cssInput = fs.createReadStream(filePath);

      cssInput.on('data', (data) => {
        const dataString = data.toString();
        bundleInput.write(dataString);
      });
    }
  });
});

// node 05-merge-styles
