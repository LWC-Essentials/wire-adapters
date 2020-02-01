/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { registerInitializer } from "@lwce/store";



//
// Router management
//

// Using this constant ensures the module is loaded and the initializer registered
export const ROUTER_ENTRY = "router";

//
// Initialize the store
//
registerInitializer(
    (key) => {
        if(key===ROUTER_ENTRY) {
            return {
                route:      "store"
            }
        }
        return undefined;
    }
);

