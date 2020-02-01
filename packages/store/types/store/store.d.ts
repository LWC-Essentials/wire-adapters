/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
export declare const STORE_ENTRIES_KEY = "__lwc_store_entries__";
export declare type Initializer = (key: string) => Promise<any> | any;
export declare function registerInitializer(initializer: Initializer): void;
export declare function isPromise(v: any): boolean;
export declare type Action = () => void;
export declare type Reset = (initializer?: Initializer) => void;
export interface StoreEntry {
    loading: boolean;
    data?: any;
    error?: string;
    initialized: boolean;
    listeners: ChangeListener[];
}
export declare type ChangeListener = (entry: StoreEntry) => void;
export declare function registerListener(key: string, listener: ChangeListener): void;
export declare function unregisterListener(key: string, listener: ChangeListener): void;
export declare function initStore(store: object): void;
export declare function getStoreValues(): object;
export declare function getEntry(key: string, lazy?: boolean, initializer?: Initializer): StoreEntry;
export declare type StateUpdater = (state: any) => Promise<any> | any;
export declare function updateState(key: string, update: StateUpdater): Promise<any>;
export declare function reinitialize(key: string, initializer?: Initializer): void;
export declare function dispatch(action: Action, ...params: any[]): void;
