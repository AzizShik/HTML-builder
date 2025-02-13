const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const distPathStyle = path.join(distPath, 'style.css');
const distPathAssets = path.join(distPath, 'assets');

function mergeStyles() {
  fs.mkdir(distPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.mkdir(distPathAssets, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const styleFile = fs.writeFile(distPathStyle, '', (err) => {
    if (err) throw err;
  });
  const styleFileInput = fs.createWriteStream(distPathStyle);
  const stylesPath = path.join(__dirname, 'styles');

  fs.readdir(stylesPath, { withFileTypes: true }, (err, stats) => {
    if (err) throw err;

    stats.forEach((dirent) => {
      const fileName = dirent.name;
      const filePath = path.join(dirent.path, dirent.name);
      const fileExt = path.parse(dirent.name).ext;

      if (!dirent.isDirectory() && fileExt === '.css') {
        const fileRead = fs.createReadStream(filePath);

        fileRead.on('data', (data) => {
          const dataStr = data.toString();
          styleFileInput.write(dataStr);
        });
      }
    });
  });
}

const assetsPath = path.join(__dirname, 'assets');

function buildAssets(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, stats) => {
    if (err) throw err;

    stats.forEach((dirent) => {
      const fileName = dirent.name;
      const filePath = path.join(dirent.path, dirent.name);

      const arr = dirent.path.split('\\');
      const idx = arr.indexOf('assets');

      const parentFolder = arr.filter((item, i) => i > idx).join('\\');

      const buildAssetFolder = parentFolder
        ? path.join(parentFolder, fileName)
        : fileName;

      const projectDir = path.join(distPathAssets, buildAssetFolder);

      if (dirent.isFile()) {
        fs.copyFile(filePath, projectDir, (err) => {
          if (err) throw err;
        });
      }

      if (dirent.isDirectory()) {
        fs.mkdir(projectDir, { recursive: true }, (err) => {
          if (err) throw err;
        });

        const assetsNewDir = path.join(assetsPath, buildAssetFolder);

        buildAssets(assetsNewDir);
      }
    });
  });
}

function updateAssets(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, stats) => {
    if (err) throw err;

    stats.forEach((dirent) => {
      const filePath = path.join(dirent.path, dirent.name);
      const arr = dirent.path.split('\\');
      const idx = arr.indexOf('assets');

      const parentFolderDir = arr.filter((_, i) => i > idx).join('\\');

      const fileFolderDir = path.join(
        assetsPath,
        parentFolderDir ? parentFolderDir : '',
      );

      if (dirent.isFile()) {
        fs.readdir(fileFolderDir, (err, stats) => {
          if (err) throw err;

          if (!stats.includes(dirent.name)) {
            fs.unlink(filePath, (err) => {
              if (err) throw err;
            });
          }
        });
      }

      if (dirent.isDirectory()) {
        fs.readdir(fileFolderDir, (err, stats) => {
          if (err) throw err;

          if (!stats.includes(dirent.name)) {
            fs.rm(filePath, { recursive: true, force: true }, (err) => {
              if (err) throw err;
            });
          } else {
            updateAssets(filePath);
          }
        });
      }
    });
  });
}

const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const projectDistPath = path.join(__dirname, 'project-dist');

function replaceTemplateTags(templateContent, callback) {
  const tagRegex = /\{\{([^{}]+)\}\}/g;
  let result = templateContent;
  let match;

  async function processNextTag() {
    match = tagRegex.exec(templateContent);
    if (!match) {
      callback(null, result);
      return;
    }

    const tag = match[1];
    const componentPath = path.join(componentsPath, `${tag}.html`);

    fs.readFile(componentPath, 'utf-8', (err, componentContent) => {
      if (err) throw err;

      result = result.replace(
        new RegExp(`\\{\\{${tag}\\}\\}`, 'g'),
        componentContent,
      );

      processNextTag();
    });
  }

  processNextTag();
}

function buildPage() {
  fs.readFile(templatePath, 'utf-8', (err, templateContent) => {
    if (err) throw err;

    replaceTemplateTags(templateContent, (err, finalContent) => {
      if (err) throw err;

      const indexPath = path.join(projectDistPath, 'index.html');

      fs.writeFile(indexPath, finalContent, 'utf-8', (err) => {
        if (err) throw err;
      });
    });
  });
}

mergeStyles();
buildAssets(assetsPath);
updateAssets(distPathAssets);
buildPage();

// node 06-build-page
