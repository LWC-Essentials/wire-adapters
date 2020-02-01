/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
const users = require('./users.json');

function initRest(app) {
    app.get('/api/users', (req, res) => {
        // Ok, slowing down the request - not something to normally do in production!!!
        // This is to make the loading icon visible for some time
        const offset = (req.query.offset && parseInt(req.query.offset,10)) || 0;
        const limit = (req.query.limit && parseInt(req.query.limit,10)) || 5;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout( () => {
            return res.send({
                users:      users.slice(offset,offset+limit),
                totalCount: users.length
            });
        }, 300 );
    });

    app.get('/api/users/:id', (req, res) => {
        return res.send(users[parseInt(req.params.id,10)]);
    });
}

module.exports = { initRest }
