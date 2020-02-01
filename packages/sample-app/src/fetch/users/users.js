/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, track } from 'lwc';
import { useFetch } from '@lwce/fetch';

export default class Checkout extends LightningElement {

    @track variables = {
        offset: 0,
        limit: 10
    }

    @wire(useFetch, {
        url: '/users?offset={offset}&limit={limit}',
        variables: '$variables'
    }) users;

    get isLoading() {
        return !this.users.initialized && this.users.loading;
    }
    get hasData() {
        return this.users.initialized && this.users.data;
    }

    get pageNavigation() {
        const { offset, limit } = this.variables;
        const page = offset/limit + 1;
        const total = this.users.data.totalCount/limit + 1;
        return page.toFixed(0) + "/" + total.toFixed(0);
    }

    // Because changing a 'variables' attribute does not trigger a refresh config,
    // We have to reassign a whole new 'variables' object, by copying the old one
    // and changing the desired values
    handleFirst() {
        this.variables = {
            ...this.variables,
            offset: 0
        }
    }
    handlePrev() {
        if(this.variables.offset>0) {
            this.variables = {
                ...this.variables,
                offset: this.variables.offset - this.variables.limit
            }
        }
    }
    handleNext() {
        if( (this.variables.offset+this.variables.limit)<this.users.data.totalCount ) {
            this.variables = {
                ...this.variables,
                offset: this.variables.offset + this.variables.limit
            }
        }
    }
    handleLast() {
        this.variables = {
            ...this.variables,
            offset: Math.floor(this.users.data.totalCount / this.variables.limit) * this.variables.limit
        }
    }
    handleRefetch() {
        this.users.fetch();
    }
}
