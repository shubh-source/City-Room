const fs = require('fs');
const path = require('path');

const directoriesToScan = ['src', 'public', '.'];

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('CityRoom') || content.includes('cityroom')) {
    let newContent = content.replace(/CityRoom/g, 'HomeDo');
    newContent = newContent.replace(/cityroom_/g, 'homedo_');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.ico')) continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else {
      if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.html') || fullPath.endsWith('.json')) {
        replaceInFile(fullPath);
      }
    }
  }
}

directoriesToScan.forEach(dir => {
  if (fs.statSync(dir).isDirectory()) {
    scanDir(dir);
  } else {
    replaceInFile(dir);
  }
});
console.log('Renaming complete.');
