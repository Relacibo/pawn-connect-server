const fs = require('fs-extra');
const childProcess = require('child_process');


try {
    // Remove current build
    fs.removeSync('./app/');
    // Copy front-end files
    fs.copySync('./src/views', './app/views');
    // Transpile the typescript files
    childProcess.exec('tsc --build tsconfig.prod.json');
} catch (err) {
    console.log(err);
}
