/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire } from 'lwc';
import { useStore } from '@lwce/store';
import { ROUTER_ENTRY } from '../../commerce/router';


export default class Body extends LightningElement {

    // Poor man router, to show the use of a store...
    @wire(useStore,{key: ROUTER_ENTRY}) router;

    get isStore() {
        return this.router.data.route==='store';
    }

    get isFetch() {
        return this.router.data.route==='fetch';
    }
}
