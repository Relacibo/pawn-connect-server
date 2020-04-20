const fs = require('fs-extra');
const childProcess = require('child_process');
try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    fs.copySync('./src/views', './dist/views');
    if (!fs.existsSync('./src/config.ts')) {
        fs.copySync('./src/config.example.ts', './src/config.ts');
    }
} catch (err) {
    console.log(err);
}
