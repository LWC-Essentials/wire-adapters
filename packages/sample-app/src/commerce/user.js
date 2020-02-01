/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { registerInitializer } from "@lwce/store";



//
// User management
//

/* User definition
//Ok, Typescript would be a great match here!
(
    firstName,
    lastName
)
*/


// Using this constant ensures the module is loaded and the initializer registered
export const USER_ENTRY = "user";

// Initialize the user
registerInitializer(
    (key) => {
        if(key===USER_ENTRY) {
            return createUser();
        }
        return undefined;
    }
);

/**
 * Initialize a user with default values
 */
export function createUser() {
    const user = {
        firstName:      'John',
        lastName:       'Doe'
    }
    return user;
}
