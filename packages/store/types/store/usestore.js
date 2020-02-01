/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wire_service_1 = require("@lwc/wire-service");
const store_1 = require("./store");
//
// useStore
//
exports.useStore = Symbol('use-store');
wire_service_1.register(exports.useStore, eventTarget => {
    let connected, key;
    let pendingData = undefined;
    function updateData(data) {
        if (connected) {
            eventTarget.dispatchEvent(new wire_service_1.ValueChangedEvent(data));
        }
        else {
            pendingData = data;
        }
    }
    function dispatch(action, ...params) {
        if (action) {
            action.apply(null, params);
        }
    }
    function reinitialize(initializer) {
        store_1.reinitialize(key, initializer);
    }
    function updateEntry(entry) {
        const data = {
            loading: entry.loading,
            data: entry.data,
            error: entry.error,
            dispatch,
            reinitialize
        };
        updateData(data);
    }
    function handleConfig(options) {
        key = options.key;
        const { lazy, initializer } = options;
        const v = store_1.getEntry(key, lazy, initializer);
        updateEntry(v);
    }
    function handleConnect() {
        connected = true;
        if (pendingData) {
            updateData(pendingData);
            pendingData = undefined;
        }
        store_1.registerListener(key, updateEntry);
    }
    function handleDisconnect() {
        connected = false;
        store_1.unregisterListener(key, updateEntry);
        // We should cancel the fetch() if there
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            eventTarget.removeEventListener('disconnect', handleDisconnect);
            eventTarget.removeEventListener('connect', handleConnect);
            eventTarget.removeEventListener('config', handleConfig);
        });
    }
    // Connect the wire adapter
    eventTarget.addEventListener('config', handleConfig);
    eventTarget.addEventListener('connect', handleConnect);
    eventTarget.addEventListener('disconnect', handleDisconnect);
});
//# sourceMappingURL=usestore.js.map