const fs = require('fs');
const path = require('path');
const projectDistFolder = 'dist/merchant-frontend';
// const { Compress } = require('gzipper');
// const gzip = new Compress(projectDistFolder, null, {
//     gzip: true,
//     brotli: true
// });
const excludeFiles = [
    'firebase-messaging-sw.js'
]

module.exports = async (targetOptions, indexHtml) => {
    console.log('Transforming index.html file...')
    // await gzip.run();
    const distFolderFiles = fs.readdirSync(projectDistFolder);
    // set css and js bundles
    let jsBundleFiles = [];
    let cssBundleFiles = [];
    distFolderFiles.filter(file => excludeFiles.indexOf(file) === -1)
        .forEach(fileToUse => {
            if(path.extname(fileToUse) === '.js') {
                jsBundleFiles.push(fileToUse)
            } else if (path.extname(fileToUse) === '.css' || path.extname(fileToUse) === '.scss') {
                cssBundleFiles.push(fileToUse)
            }
        });
    const headOpenTag = '<head>';
    const headClosingTag = '</head>';
    const headContentStart = indexHtml.indexOf(headOpenTag) + headOpenTag.length;
    const headContentEnd = indexHtml.indexOf(headClosingTag);
    let headContent = indexHtml.slice(headContentStart, headContentEnd).trim();

    // append preload scripts to head
    const preloadScripts = cssBundleFiles
        .map(cssFile => `<link rel="preload" href="${cssFile}" as="style"></link>`)
        .concat(jsBundleFiles.map(jsFile => `<link rel="preload" href="${jsFile}" as="script"></link>`))
        .join('\n');
    headContent += preloadScripts;

    // append styles to head
    const cssFilesContent = cssBundleFiles
        .map(cssFile => `<link rel="stylesheet" href="${cssFile}"></link>`)
        .join('\n');
    headContent += cssFilesContent;

    // append js files to end of the body
    const bodyOpenTag = '<body>';
    const bodyClosingTag = '</body>';
    const bodyContentStart = indexHtml.indexOf(bodyOpenTag) + bodyOpenTag.length;
    const bodyContentEnd = indexHtml.indexOf(bodyClosingTag);
    let bodyContent = indexHtml.slice(bodyContentStart, bodyContentEnd).trim();
    const jsFilesContent = jsBundleFiles
        .map(jsFile => {
            if(jsFile.includes('es2015')) {
                // then module
                return `<script src="${jsFile}" type="module"></script>`
            } else if(jsFile.includes('es5')) {
                // then no module
                return `<script src="${jsFile}" nomodule defer></script>`
            }
        })
        .join('\n');
    bodyContent += jsFilesContent;

    // now put it all back together
    const preHeaderContent = indexHtml.slice(0, headContentStart - headOpenTag.length).trim();
    const html = `${preHeaderContent}<head>${headContent}</head><body>${bodyContent}</body></html>`;
    console.log('Finished transforming index.html...')
    return html;
};



