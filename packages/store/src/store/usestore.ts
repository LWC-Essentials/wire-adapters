/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/

import { StoreEntry, getEntry } from './store';


//
// useStore
//

interface DataCallback {
    (value: any): void;
}

export class useStore {
    dataCallback: DataCallback;

    connected: boolean = false
    pendingEntry: StoreEntry|undefined = undefined;

    constructor(dataCallback: DataCallback) {
        this.dataCallback = dataCallback;
    }

    update(config: Record<string, any>) {
        const { key, initializer, mode } = config;
        const v = getEntry(key,initializer,mode);
        this.updateEntry(v);
    }

    connect() {
        this.connected = true;
        if(this.pendingEntry) {
            this.updateEntry(this.pendingEntry);
            this.pendingEntry = undefined;
        }
    }

    disconnect() {
        this.connected = false;
    }

    updateEntry(entry: StoreEntry): void {
        if(this.connected) {
            const uw = entry;
            this.dataCallback(uw)
        } else {
            this.pendingEntry = entry;
        }
    }
}
