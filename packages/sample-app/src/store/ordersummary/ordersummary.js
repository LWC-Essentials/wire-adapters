/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, track } from 'lwc';
import { useStore } from '@lwce/store';
import { CART_ENTRY } from '../../commerce/cart';


export default class Checkout extends LightningElement {
    static renderMode = 'light';

    //@wire(useStore,{key: CART_ENTRY}) cart;
    @track cart;
    @wire(useStore,{key: CART_ENTRY}) function(value) {
        this.cart = value;
    };

    get summary() {
        if(this.cart.data) {
            return {
                sub:    this.cart.data.totalbt,
                ship:   this.cart.data.shipping,
                tax:    this.cart.data.tax,
                total:  this.cart.data.total
            }

        }
        return {
            sub:    0,
            ship:   0,
            tax:    0,
            total:  0
        }
    }
}
