/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
//
// Script used to update the file headers with a license
// This can eventually be packaged as a reusable library 
//

const fs = require('fs');

const ENCODING = 'utf8';
const TRACE = false;


function shouldProcessFolder(path) {
    if(path.endsWith('/node_modules')) {
        return false;
    }
    if(path.endsWith('/dist')) {
        return false;
    }
    return true;
}

function shouldProcessFile(path) {
    return true;
}

function getHeaderProperties(path) {
    if(shouldProcessFile(path)) {
        if(path.endsWith('.js')) {
            return {
                encoding:       ENCODING,
                startComment:   '/*',
                endComment:     '*/',
                tags:           ['Copyright (c)','salesforce.com, inc.']
            }
        }
        if(path.endsWith('.ts')) {
            return {
                encoding:       ENCODING,
                startComment:   '/*',
                endComment:     '*/',
                tags:           ['Copyright (c)','salesforce.com, inc.']
            }
        }
        if(path.endsWith('.html')) {
            return {
                encoding:       ENCODING,
                startComment:   '<!--',
                endComment:     '-->',
                tags:           ['Copyright (c)','salesforce.com, inc.']
            }
        }
        if(path.endsWith('.css')) {
            return {
                encoding:       ENCODING,
                startComment:   '/*',
                endComment:     '*/',
                tags:           ['Copyright (c)','salesforce.com, inc.']
            }
        }
    }
    return null;
}

const LICENSE_CONTENT = `
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
`;
    
function loadLicenseContent(path,options) {
    return (options.license && options.license()) || LICENSE_CONTENT;
}

function findEncoding(path,options) {
    return (options.encoding && options.encoding()) || ENCODING;
}


// Some polyfills
(function(w){
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart
    var String=w.String, Proto=String.prototype;
    (function(o,p){
        if(p in o?o[p]?false:true:true){
            var r=/^\s+/;
            o[p]=o.trimLeft||function(){
                return this.replace(r,'')
            }
        }
    })(Proto,'trimStart');

})(global); 


function processFile(path, options) {
    const headerProperties = getHeaderProperties(path);
    if(!headerProperties) {
        return;
    }

    const encoding = findEncoding(path,options);

    function loadFile() {
        return fs.readFileSync(path, encoding);
    }
    function saveFile(content) {
        console.log('Updated file: '+path);
        fs.writeFileSync(path,content, {encoding});
    }

    function createFileHeader(_text) {
        const header = loadLicenseContent(path,options);
        if(header) {
            return headerProperties.startComment + header + headerProperties.endComment + '\n';
        }
        return null;
    }

    function isLicenseComment(comment) {
        for(let i=0; i<headerProperties.tags.length; i++) {
            const t = headerProperties.tags[i];
            if(comment.indexOf(t)<0) {
                return false;
            }
        }
        return true;
    }

    function removeHeader(text) {
        if(text.startsWith(headerProperties.startComment)) {
            const end = text.indexOf(headerProperties.endComment);
            if(end>=0) {
                const comment = text.substring(0,end);
                if(isLicenseComment(comment)) {
                    if(TRACE) {
                        console.log('Found copyright header in: '+path);
                    }
                    return text.substring(end+headerProperties.endComment.length+1);
                }
            }
        }
        return text;
    }

    function replaceHeaderIfDifferent(_text,header) {
        let text = _text.trimLeft();
        if(text.startsWith(header)) { // Ok, no need for a change...
            return false;
        }

        text = removeHeader(text);
        text = header + text;
        return text;
    }


    if(TRACE) {
        console.log("Processing file: "+path);
    }
    const fileContent = loadFile();
    const header = createFileHeader(fileContent);
    const processedContent = replaceHeaderIfDifferent(fileContent,header);
    if(processedContent) {
        saveFile(processedContent)
    }
}

function processFolder(path, options) {
    if(!shouldProcessFolder(path)) {
        return;
    }
    if(TRACE) {
        console.log("Processing folder: "+path);
    }
    fs.readdirSync(path).forEach(function(file) {
        const filePath = path + "/" + file;
        let stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if(options.recursive) {
                return processFolder(filePath, options);
            }
        } else {
            return processFile(filePath, options);
        }
      });
} 

function updateFolder(folder, options) {
    if(!folder.charAt(0)!=='/') {
        folder = '/' + folder;
    }
    const path = __dirname+'/..'+folder;
    processFolder(path, options);
} 

function updateFile(file, options) {
    if(!file.chatAt(0)!=='/') {
        file = '/' + file;
    }
    const path = __dirname+'/..'+file;
    processFile(path, options);
} 

module.exports = {
    updateFolder,
    updateFile
}
