/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORE_ENTRIES_KEY = '__lwc_store_entries__';
const initializers = [];
function registerInitializer(initializer) {
    initializers.push(initializer);
}
exports.registerInitializer = registerInitializer;
function isPromise(v) { return v && typeof v.then == 'function'; }
exports.isPromise = isPromise;
function getStoreEntries() {
    return window[exports.STORE_ENTRIES_KEY] || (window[exports.STORE_ENTRIES_KEY] = {});
}
function getStoreEntry(key) {
    const entries = getStoreEntries();
    if (!entries.hasOwnProperty(key)) {
        entries[key] = {
            loading: false,
            data: undefined,
            error: undefined,
            initialized: false,
            listeners: []
        };
    }
    return entries[key];
}
function notifyListeners(entry) {
    for (let l of entry.listeners) {
        l(entry);
    }
}
function registerListener(key, listener) {
    getStoreEntry(key).listeners.push(listener);
}
exports.registerListener = registerListener;
function unregisterListener(key, listener) {
    const e = getStoreEntry(key);
    const pos = e.listeners.indexOf(listener);
    if (pos >= 0) {
        e.listeners.splice(pos, 1);
    }
}
exports.unregisterListener = unregisterListener;
function initStore(store) {
    throw new Error("Not implemented");
}
exports.initStore = initStore;
function getStoreValues() {
    throw new Error("Not implemented");
}
exports.getStoreValues = getStoreValues;
/**
 * Access a specific value from the store.
 * This function can return on of the 3 possible values:
 *   - A promise
 *     This happens if the value is being loaded asynchronously. The promise
 *     will resolve then the value will be available
 *   - A value (or null)
 *     If the value has already been resolved, then that value is returned
 * @param key the key of the value to access
 */
function initEntry(entry, key, initializer) {
    function init(entry, key, initializer) {
        if (initializer) {
            const v = initializer(key);
            if (v !== undefined) {
                // If it is a promise, then wait for it to be resolved
                // And return a promise so the caller knows when the value is available
                if (isPromise(v)) {
                    Object.assign(entry, {
                        loading: true,
                        data: undefined,
                        error: undefined,
                        initialized: false
                    });
                    notifyListeners(entry);
                    v.then((data) => {
                        Object.assign(entry, {
                            loading: false,
                            initialized: true,
                            data
                        });
                        notifyListeners(entry);
                        return entry;
                    }).catch((err) => {
                        Object.assign(entry, {
                            loading: false,
                            initialized: true,
                            error: err.toString()
                        });
                        notifyListeners(entry);
                        return entry;
                    });
                }
                else {
                    Object.assign(entry, {
                        data: v,
                        error: undefined,
                        initialized: true,
                    });
                    notifyListeners(entry);
                }
                return true;
            }
        }
        return false;
    }
    if (init(entry, key, initializer)) {
        return;
    }
    for (let i of initializers) {
        if (init(entry, key, i)) {
            return;
        }
    }
}
function getEntry(key, lazy, initializer) {
    // If the value is already in the store, then no initialization is required
    const entry = getStoreEntry(key);
    if (!entry.initialized && !entry.loading && !lazy) {
        initEntry(entry, key, initializer);
    }
    return entry;
}
exports.getEntry = getEntry;
function updateState(key, update) {
    const entry = getStoreEntry(key);
    if (entry.initialized && !entry.error) {
        const r = update(entry.data);
        if (isPromise(r)) {
            return r.then((state) => {
                if (state !== undefined) {
                    entry.data = state;
                }
                notifyListeners(entry);
            });
        }
        else {
            if (r !== undefined) {
                entry.data = r;
            }
            notifyListeners(entry);
            return Promise.resolve();
        }
    }
    return Promise.reject("Entry is not initialized or has an error");
}
exports.updateState = updateState;
function reinitialize(key, initializer) {
    const entry = getStoreEntries()[key];
    if (entry) {
        // Do not reinitialize the listeners!
        Object.assign(entry, {
            loading: false,
            data: undefined,
            error: undefined,
            initializing: false,
            initialized: false,
        });
        initEntry(entry, key, initializer);
        notifyListeners(entry);
    }
}
exports.reinitialize = reinitialize;
function dispatch(action, ...params) {
    if (action) {
        action.apply(null, params);
    }
}
exports.dispatch = dispatch;
//# sourceMappingURL=store.js.map