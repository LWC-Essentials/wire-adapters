/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
const STORE_ENTRIES_KEY = '__lwce_store__'

export enum Mode {
    NORMAL,
    LAZY,
    FORCE
}


//
// The initializers are registered globally in the module.
// This is because they are shared by all the requests in case of SSR
//
export type Initializer = (key: string) => Promise<any>|any;

const initializers: Initializer[] = [];
export function registerInitializer(initializer: Initializer): void {
    initializers.push(initializer);
}

export function isPromise(v: any) { return v && typeof v.then == 'function'; }

export type Action = (state: any, ...params: any) => Promise<any>|any;

export type Reset = (initializer?: Initializer) => void;

export interface StoreEntry {
    loading:        boolean;
    data?:          any;
    error?:         string;
    initialized:    boolean;
} 

export type ChangeListener = (entry: StoreEntry) => void

export function hasStore(): boolean {
    return !!((window as any)[STORE_ENTRIES_KEY]);
}

export function setStore(store: Record<string,object>, content?: Record<string,object>): void {
    (window as any)[STORE_ENTRIES_KEY] = store;
    if(content) {
        Object.assign( store, content);
    }
}

function getStoreEntries(): Record<string,StoreEntry> {
    const store: any = (window as any)[STORE_ENTRIES_KEY];
    if(store) {
        return store;
    }
    throw new Error("Internal Error: Store is not initialized");
}

function getStoreEntry(key: string): StoreEntry {
    const entries = getStoreEntries();
    if(!entries.hasOwnProperty(key)) {
        entries[key] = {
            loading: false,
            data: undefined,
            error: undefined,
            initialized: false
        }
    }
    return entries[key];
}

export function serialize(): object {
    throw new Error("Not implemented");
}

function initEntry(entry: StoreEntry, key: string, initializer?: Initializer): void {

    function init(entry: StoreEntry, key: string, initializer?: Initializer): boolean {
        if(initializer) {
            const v = initializer(key);
            if(v!==undefined) {
                // If it is a promise, then wait for it to be resolved
                // And return a promise so the caller knows when the value is available
                if(isPromise(v)) {
                    Object.assign(entry, {
                        loading: true,
                        initialized: false
                    });
                    v.then( (data: any) => {
                        Object.assign(entry, {
                            loading: false,
                            initialized: true,
                            data
                        });
                        return entry;
                    }).catch( (err: any) => {
                        Object.assign(entry, {
                            loading: false,
                            initialized: true,
                            error: (err && err.toString()) || "Error"
                        });
                        return entry;
                    });
                } else {
                    Object.assign(entry, {
                        data: v,
                        error: undefined,
                        initialized: true,
                    });
                }
                return true;
            }
        }
        return false;
    }

    if(init(entry,key,initializer)) {
        return;
    }
    for(let i of initializers) {
        if(init(entry,key,i)) {
            return;
        }
    }
    init(entry,key, () => {});
}

export function hasEntry(key: string): boolean {
    const entries = getStoreEntries();
    return entries.hasOwnProperty(key);
}

export function getEntry(key: string, initializer?: Initializer, mode?: Mode): StoreEntry {
    // If the value is already in the store, then no initialization is required
    const entry = getStoreEntry(key);

    if(!entry.loading && (mode===Mode.FORCE || ( (mode===undefined || mode===Mode.NORMAL) && !entry.initialized))) {
        initEntry(entry,key,initializer);
    }

    return entry;
}

export function reinitialize(key: string, initializer?: Initializer): void {
    getEntry(key,initializer,Mode.FORCE);
}
