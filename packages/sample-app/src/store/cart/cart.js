/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, track } from 'lwc';
import { useStore } from '@lwce/store';
import { addToCart, calculateCart, CART_ENTRY } from '../../commerce/cart';



export default class Cart extends LightningElement {
    static renderMode = 'light';

    //@wire(useStore,{key: CART_ENTRY}) cart;
    @track cart;
    @wire(useStore,{key: CART_ENTRY}) function(value) {
        this.cart = value;
    };
    
    handleAdd() {
        // Direct update: it use the membrane capability to update the listeners
        addToCart(this.cart.data);
    }

    _findIndex(event) {
        for(let e = event.target; e; e=e.parentNode) {
            if(e.hasAttribute('data-index')) {
                return parseInt(e.getAttribute('data-index'),10);
            }
        }
        throw new Error();
    }
    _findItem(event) {
        return this.cart.data.items[this._findIndex(event)];
    }

    handleIncQuantity(event) {
        const it = this._findItem(event);
        it.quantity++;
        calculateCart(this.cart.data);
    }
    handleDecQuantity(event) {
        const it = this._findItem(event);
        if(it.quantity>1) {
            it.quantity--;
            calculateCart(this.cart.data);
        }
    }
    handleDelete(event) {
        const idx = this._findIndex(event);
        this.cart.data.items.splice(idx,1)
        calculateCart(this.cart.data);
    }
}
