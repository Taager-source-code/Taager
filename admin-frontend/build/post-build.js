/**
 * @description this script runs as an extra step after the build
 * step, the file retrieves 2 values, the application version from
 * the package.json file and the build hash that is concatenated to
 * the build file names, it then writes the 2 values in a new file
 * version.json and overwrites the {{POST_BUILD_ENTERS_HASH_HERE}}
 * placeholder in the version-check service, for the service to be
 * able to compare the hashes and see if a new version of the app
 * is available.
 */
const path = require("path");
const fs = require("fs");
const util = require("util");
// get application version from package.json
const appVersion = require("../package.json").version;
// promisify core API's
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
console.log("\nRunning post-build tasks");
const BUILD_PATH = "../dist/taager-admin";
// our version.json will be in the dist folder
const versionFilePath = path.join(__dirname, `${BUILD_PATH}/version.json`);
let mainHash = "";
let mainBundleFile = "";
// RegExp to find main.bundle.js, even if it doesn't include a hash in it's name (dev build)
let mainBundleRegexp = /^main\-es5.?([a-z0-9]*)?.js$/;
// read the dist folder files and find the one we're looking for
readDir(path.join(__dirname, BUILD_PATH))
  .then((files) => {
    mainBundleFile = files.find((f) => mainBundleRegexp.test(f));
    if (mainBundleFile) {
      let matchHash = mainBundleFile.match(mainBundleRegexp);
      // if it has a hash in it's name, mark it down
      if (matchHash.length > 1 && !!matchHash[1]) {
        mainHash = matchHash[1];
      }
    }
    console.log(`Writing version and hash to ${versionFilePath}`);
    // write current version and hash into the version.json file
    const src = `{"version": "${appVersion}", "hash": "${mainHash}"}`;
    return writeFile(versionFilePath, src);
  })
  .then(() => {
    // main bundle file not found, dev build?
    if (!mainBundleFile) {
      return;
    }
    console.log(`Replacing hash in the ${mainBundleFile}`);
    // replace hash placeholder in our main.js file so the code knows it's current hash
    const mainFilepath = path.join(__dirname, BUILD_PATH, mainBundleFile);
    return readFile(mainFilepath, "utf8").then((mainFileData) => {
      const replacedFile = mainFileData.replace(
        "{{POST_BUILD_ENTERS_HASH_HERE}}",
        mainHash
      );
      return writeFile(mainFilepath, replacedFile);
    });
  })
  .catch((err) => {
    console.log("Error with post build:", err);
  });
