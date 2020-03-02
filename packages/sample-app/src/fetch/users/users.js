/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, track } from 'lwc';
import { useFetch } from '@lwce/fetch';

export default class Users extends LightningElement {

    @track queryParams = {
        offset: 0,
        limit: 10
    }
    @wire(useFetch, {
        url: '/users',
        queryParams: '$queryParams'
    }) users;

    @track variables = {
        userId: 'xyz'
    }
    @wire(useFetch, {
        url: '/users/{userId}',
        lazy: true,
        variables: '$variables'
    }) userById;

    get isLoading() {
        return !this.users.initialized && this.users.loading;
    }
    get hasData() {
        return this.users.initialized && this.users.data;
    }

    get pageNavigation() {
        const { offset, limit } = this.queryParams;
        const page = offset/limit + 1;
        const total = this.users.data.totalCount/limit + 1;
        return page.toFixed(0) + "/" + total.toFixed(0);
    }

    // Because changing a 'queryParams' attribute does not trigger a refresh config,
    // We have to reassign a whole new 'queryParams' object, by copying the old one
    // and changing the desired values
    handleFirst() {
        this.queryParams = {
            ...this.queryParams,
            offset: 0
        }
    }
    handlePrev() {
        if(this.queryParams.offset>0) {
            this.queryParams = {
                ...this.queryParams,
                offset: this.queryParams.offset - this.queryParams.limit
            }
        }
    }
    handleNext() {
        if( (this.queryParams.offset+this.queryParams.limit)<this.users.data.totalCount ) {
            this.queryParams = {
                ...this.queryParams,
                offset: this.queryParams.offset + this.queryParams.limit
            }
        }
    }
    handleLast() {
        this.queryParams = {
            ...this.queryParams,
            offset: Math.floor(this.users.data.totalCount / this.queryParams.limit) * this.queryParams.limit
        }
    }
    handleRefetch() {
        this.users.fetch();
    }

    _findUserIdx(event) {
        for(let e=event.target; e; e=e.parentNode) {
            if(e.hasAttribute && e.hasAttribute("useridx")) {
                return parseInt(e.getAttribute("useridx"),10);
            }
        }
        return undefined;
    }

    handleUserClick(event) {
        const idx = this._findUserIdx(event);
        if(idx!==undefined) {
            this.userById.fetch(undefined,undefined,{userId:this.users.data.users[idx].email}).then( () => {
                // eslint-disable-next-line no-alert
                alert(JSON.stringify(this.userById.data));
            });
        }
    }
}
