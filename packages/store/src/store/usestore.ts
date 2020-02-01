/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { unwrap } from '@lwc/engine';
import { register, ValueChangedEvent } from '@lwc/wire-service';

import { StoreEntry, getEntry } from './store';


//
// useStore
//

export const useStore = Symbol('use-store');

register(useStore, eventTarget => {

    let connected: boolean,
        pendingEntry: StoreEntry|undefined = undefined;

    function updateEntry(entry: StoreEntry): void {
        if(connected) {
            const uw = unwrap(entry);
            eventTarget.dispatchEvent(new ValueChangedEvent(uw));
        } else {
            pendingEntry = entry;
        }
    }

    function handleConfig(options: any): void {
        const { key, initializer, mode } = options;
        const v = getEntry(key,initializer,mode);
        updateEntry(v);
    }

    function handleConnect() {
        connected = true;
        if(pendingEntry) {
            updateEntry(pendingEntry);
            pendingEntry = undefined;
        }
    }

    function handleDisconnect() {
        connected = false;
 
        // We should cancel the fetch() if there
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout( () => {
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
