/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, track, createElement } from "lwc";
import { hasStore, setStore  } from "./store";

import tmp from './StoreComponent.html'
import tmpe from './StoreComponentEmpty.html'

//
// Initialize the store
//
// We create the proxied store by using a fake component. This is a workaround
// until we can get a better API from LWC core.
//
// As the whole library is Typescript and we do not invoke the LWC compiler, this
// file will be copied as is to the /dist folder. Also, the generated index.js is
// overridden to export 'initStore', as it can't be exported from Typescript.
//
let DEBUG_STORE = false;
const ELEMENT_NANE = "lwce-store";

export default class StoreComponent extends LightningElement {
    
    debug = DEBUG_STORE;
    @track _store = {};
    @track asJson = {}

    get store() {
        return this._store;
    }

    connectedCallback() {
        setStore(this._store);
    }

    render() {
        return this.debug ? tmp : tmpe;
    }

    onRefresh() {
        this.asJson = JSON.stringify(this._store,null,"  ");
    }
    
    get storeAsJson() {
        return this.asJson;
    }
}

export function initStore(content) {
    if(hasStore()) {
        throw new Error("The store is already initialized");
    }
    // Check that we are running in a browser
    // SSR will be different
    if(window && window.document) {
        const elt = createElement(ELEMENT_NANE, { is: StoreComponent });
        document.body.appendChild(elt);
    } else {
        setStore({},content);
    }
}

export function setDebugStore(debug) {
    DEBUG_STORE = debug;
    const elts = document.getElementsByTagName(ELEMENT_NANE);
    for(let i=0; i<elts.length; i++) {
        elts[i].debug = debug;
      }
}
