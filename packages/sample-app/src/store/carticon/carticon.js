/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, track } from 'lwc';
import { useStore } from '@lwce/store';
import { CART_ENTRY } from '../../commerce/cart';


export default class Cart extends LightningElement {
    static renderMode = 'light';

    //@wire(useStore,{key: CART_ENTRY}) cart;
    @track cart;
    @wire(useStore,{key: CART_ENTRY}) function(value) {
        this.cart = value;
    };
 
   get itemCount() {
        if(this.cart.data) {
            const count = this.cart.data.items.reduce( (total,item) => (total+item.quantity), 0);
            return count;
        }
        return 0;
    }
 }
