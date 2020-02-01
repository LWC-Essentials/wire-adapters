/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { registerInitializer } from "@lwce/store";



//
// Commerce cart management
//

/* Card definition
//Ok, Typescript would be a great match here!
(
    items: [
        {
            id,
            label,
            quantity,
            price
            total
        }
    ]
    tax,
    totalbt,
    shipping,
    total,
)
*/


// Using this constant ensures the module is loaded and the initializer registered
export const CART_ENTRY = "cart";

//
// Initialize the store
//
registerInitializer(
    (key) => {
        if(key===CART_ENTRY) {
            const init = createCart();
            // We can return a value or get it from a promise
            //return init;
            return new Promise( (resolve ) => {
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                const id = setTimeout( () => {
                    clearTimeout(id);
                    resolve(init);
                }, 1000);
            })
        }
        return undefined;
    }
);

const TAX_RATE = 0.06;
const SHIPPING_RATE = 3;
const PRODUCTS = [
    {
        id: 'b001',
        label: 'Corona Extra',
        desc: '24-12oz Btls',
        price: 25.49
    },
    {
        id: 'b002',
        label: 'Heineken',
        desc: '24-12oz Btls',
        price: 24.79
    },
    {
        id: 'b003',
        label: 'Stella Artois',
        desc: '12pk-11oz Btls',
        price: 13.49
    },
    {
        id: 'b004',
        label: 'Guinness Extra Stout',
        desc: '12pk-11oz Btls',
        price: 13.79
    },
    {
        id: 'b005',
        label: 'Beck\'s',
        desc: '12pk-12oz Btls',
        price: 11.49
    },
    {
        id: 'b006',
        label: 'Dos Equis Lager Especial',
        desc: '12pk-12oz Btls',
        price: 11.99
    },
    {
        id: 'b007',
        label: 'Peroni Nastro Azzurro',
        desc: '12pk-11oz Btls',
        price: 13.49
    },
    {
        id: 'b008',
        label: 'Modelo Negra',
        desc: '12pk-12oz Btls',
        price: 13.39
    }
]

/**
 * Initialize a cart with default values
 */
export function createCart() {
    const cart = {
        items: [],
        tax: 0,
        totalbt: 0,
        total: 0
    }
    return cart;
}


/**
 * Calculate the cart data
 */
export function calculateCart(cart) {
    if(!cart) {
        return;
    }
    let t = 0, c = 0;
    for(let i=0; i<cart.items.length; i++) {
        const item = cart.items[i];
        item.total = item.price * item.quantity;
        t += item.total;
        c += item.quantity;
    }
    cart.totalbt = t;
    cart.tax = t*TAX_RATE;
    cart.shipping = c * SHIPPING_RATE;
    cart.total = cart.totalbt + cart.tax;
}

/**
 * Add a new item to the cart
 */
export function addToCart(cart) {
    if(!cart) {
        return;
    }
    if(cart.items.length>=PRODUCTS.length) {
        return;
    }
    function contains(idx) {
        for(let i=0; i<cart.items.length; i++) {
            const it = cart.items[i];
            if(it.id===PRODUCTS[idx].id) {
                return true;
            }
        }
        return false;
    }

    // Add the first one that is not yet in the cart
    for(let i=0; i<PRODUCTS.length; i++) {
        if(!contains(i)) {
            const p = PRODUCTS[i];
            const item = {
                id: p.id,
                label: p.label,
                quantity: 1,
                price: p.price,
                image: 'static/images/'+p.id+'.png'
            }
            cart.items.push(item);
            calculateCart(cart);
            return;
        }
    }
}
