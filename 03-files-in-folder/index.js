const path = require('path');
// const fs = require('fs');
const fs = require('fs/promises');

const folderPath = path.join(__dirname, 'secret-folder');

// fs.readdir(folderPath, (err, files) => {
//   if (err) throw err;

//   files.forEach((file) => {
//     const filePath = path.join(__dirname, 'secret-folder', file);
//     fs.stat(filePath, (err, stats) => {
//       if (err) throw err;

//       const fileNameWithoutExt = path.basename(file, path.extname(file));
//       const fileExt = path.extname(file).substring(1);
//       const fileSize = (stats.size / 1024).toFixed(3) + 'kb';

//       if (stats.isFile()) {
//         process.stdout.write(`${fileNameWithoutExt} ${fileExt} ${fileSize} \n`);
//       }
//     });
//   });
// });

async function readDirectory() {
  try {
    const itemsDirentArr = await fs.readdir(folderPath, {
      withFileTypes: true,
    });

    for (let dirent of itemsDirentArr) {
      if (!dirent.isFile()) continue;

      const stat = await fs.stat(path.join(folderPath, dirent.name));

      const fileNameWithoutExt = path.parse(dirent.name).name;
      const fileExt = path.extname(dirent.name).substring(1);
      const fileSize = (stat.size / 1024).toFixed(3) + 'kb';

      process.stdout.write(
        `${fileNameWithoutExt} - ${fileExt} - ${fileSize} \n`,
      );
    }
  } catch (error) {
    console.log(error);
  }
}

readDirectory();
