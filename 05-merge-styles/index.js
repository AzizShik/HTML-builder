const path = require('path');
const fs = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const { pipeline } = require('stream/promises');

const cssSrcPath = path.join(__dirname, 'styles');
const bundleCssPath = path.join(__dirname, 'project-dist');

async function bundleStyles(stylesPath, bundlePath) {
  try {
    const folderDirent = await fs.readdir(stylesPath, { withFileTypes: true });

    const bundleFilePath = path.join(bundlePath, 'bundle.css');

    const writableStream = createWriteStream(bundleFilePath);

    for (const dirent of folderDirent) {
      const filePath = path.join(stylesPath, dirent.name);
      const fileExt = path.parse(dirent.name).ext;

      if (fileExt === '.css' && dirent.isFile()) {
        const readStream = createReadStream(filePath, 'utf-8');

        await pipeline(readStream, writableStream, { end: false });
      }
    }

    writableStream.end();
  } catch (error) {
    console.log(error);
  }
}

bundleStyles(cssSrcPath, bundleCssPath);
