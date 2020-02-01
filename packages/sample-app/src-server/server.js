/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// -- Libs -----------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const express = require('express');
const useragent = require('useragent');

const compression = require('compression')

// -- Config ----------------------------------------------------------------------------
const template  = fs.readFileSync(path.join(__dirname, '../public/template.html'), 'utf8');
const log = process.stdout.write.bind(process.stdout);
const port = process.env.PORT || 3001;
const app = express();

const production = false;

// Production configuration
if(production) {
    app.use(compression())
}


// -- Helpers ---------------------------------------------------------------------------
function isCompat(req) {
    if(req.query['compat'] || req.query['compat']==="") {
        return req.query['compat']!=="false";
    }
    const userAgent = req.headers['user-agent'];
    const { family, major } = useragent.parse(userAgent);
    const majorVersion = parseInt(major, 10);
    return family === 'IE'
        || (family === 'Chrome'  && majorVersion < 48)
        || (family === 'Firefox' && majorVersion < 52)
        || (family === 'Safari'  && majorVersion < 10);
}

function staticPath(...args) {
    return path.join(__dirname+"/..", 'public', ...args);
}

function renderTemplate(template,isCompat) {
    const lwccomponents = (isCompat ? 'lwc-components-compat' : 'lwc-components') + (production ? ".min.js" : ".js");
    return template
        .replace('{{lwc-components}}', lwccomponents);
}


// -- Middlewares ------------------------------------------------------------------------
app.use('/static', express.static(staticPath()));

app.get('/', (req, res) => {
    const isCompatMode = isCompat(req);
    res.send(renderTemplate(template,isCompatMode));
});


// -- REST services  ---------------------------------------------------------------------
const rest = require('./rest');
rest.initRest(app);


// -- Server Start -----------------------------------------------------------------------
module.exports.start = () => {
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            log(`Server ready\n`);
            log(`  http://localhost:${port}\n`);
            resolve(server);
        });
    });
};
