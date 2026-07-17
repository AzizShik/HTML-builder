const path = require('path');
const fs = require('fs/promises');

const filesSrcPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

async function copyDir(filesSrcPath, filesCopyPath) {
  try {
    await fs.rm(filesCopyPath, { recursive: true, force: true });

    await fs.mkdir(filesCopyPath, { recursive: true });

    const itemsDirentArr = await fs.readdir(filesSrcPath, {
      withFileTypes: true,
    });

    for (const dirent of itemsDirentArr) {
      const srcPath = path.join(filesSrcPath, dirent.name);
      const copyPath = path.join(filesCopyPath, dirent.name);

      if (dirent.isDirectory()) {
        await copyDir(srcPath, copyPath);
      }

      if (dirent.isFile()) {
        await fs.copyFile(srcPath, copyPath);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

copyDir(filesSrcPath, filesCopyPath);
