/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire } from 'lwc';
import { useStore } from '@lwce/store';
import { USER_ENTRY } from '../../commerce/user';
import { ROUTER_ENTRY } from '../../commerce/router';


export default class Header extends LightningElement {

    @wire(useStore, {key: USER_ENTRY}) user;
    @wire(useStore,{key: ROUTER_ENTRY}) router;

    handleStore() {
        this.router.data.route = 'store'
    }

    handleFetch() {
        this.router.data.route = 'fetch'
    }

}
