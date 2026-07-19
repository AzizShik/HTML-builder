const { createWriteStream, createReadStream } = require('fs');
const fs = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream/promises');

async function buildPage() {
  try {
    const assetsSrcPath = path.join(__dirname, 'assets');
    const assetsCopyPath = path.join(__dirname, 'project-dist', 'assets');

    const stylesPath = path.join(__dirname, 'styles');

    const templateHtmlPath = path.join(__dirname, 'template.html');
    const componentsPath = path.join(__dirname, 'components');

    const distPath = path.join(__dirname, 'project-dist');
    await fs.rm(distPath, { recursive: true, force: true });
    await fs.mkdir(distPath, { recursive: true });

    await Promise.all([
      copyDir(assetsSrcPath, assetsCopyPath),
      bundleStyles(stylesPath, distPath, 'style.css'),
      bundleHtml(templateHtmlPath, componentsPath, distPath),
    ]);
  } catch (error) {
    console.log(error);
  }
}

async function bundleHtml(templatePath, componentsDir, distPath) {
  try {
    let templateHtml = await fs.readFile(templatePath, { encoding: 'utf-8' });

    const componentRegex = /{{(.*?)}}/g;
    const matches = [...templateHtml.matchAll(componentRegex)];

    for (const match of matches) {
      const tag = match[0];
      const componentName = match[1];
      const componentPath = path.join(componentsDir, `${componentName}.html`);

      try {
        const componentHtml = await fs.readFile(componentPath, {
          encoding: 'utf-8',
        });

        templateHtml = templateHtml.replaceAll(tag, componentHtml);
      } catch (error) {
        console.log(error);
      }
    }

    const indexPath = path.join(distPath, 'index.html');
    await fs.writeFile(indexPath, templateHtml, 'utf-8');
  } catch (error) {
    console.log(error);
  }
}

async function copyDir(filesSrcPath, filesCopyPath) {
  try {
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

async function bundleStyles(stylesPath, bundlePath, bundleName) {
  try {
    const folderDirent = await fs.readdir(stylesPath, { withFileTypes: true });

    const bundleFilePath = path.join(bundlePath, bundleName);

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

buildPage();
