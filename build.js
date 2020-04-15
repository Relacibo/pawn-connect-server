const fs = require('fs-extra');
const childProcess = require('child_process');


try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    fs.copySync('./src/views', './dist/views');
} catch (err) {
    console.log(err);
}
// Transpile the typescript files
childProcess.exec('tsc --build tsconfig.prod.json', (err, stdout, stderr) => {
    if (err) {
        console.error(err)
      } else {
       console.log(`stdout: ${stdout}`);
       console.log(`stderr: ${stderr}`);
      }
});
