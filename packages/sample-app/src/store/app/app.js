/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement } from 'lwc';
import { getEntry, reinitialize } from '@lwce/store';
import { addToCart } from '../../commerce/cart';

export default class App extends LightningElement {

    handleAddBeer() {
        const cart = getEntry("cart");
        if(cart.data) {
            addToCart(cart.data);
        }
    }

    handleReset() {
        reinitialize("cart");
    }
}
