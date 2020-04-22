import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
// Setup command line options
const options = commandLineArgs([
    {
        name: 'env',
        alias: 'e',
        defaultValue: 'production',
        type: String,
    },
]);
const path = `./env/${options.env}.env`;
if (fs.existsSync(path)) {
    // Set the env file
    const result2 = dotenv.config({ path });
    if (result2.error) {
        throw result2.error;
    }
}
