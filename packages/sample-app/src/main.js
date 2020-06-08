/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { createElement, register } from "lwc";
import { FetchClient, setFetchClient } from "@lwce/fetch";
import { initStore, setDebugStore } from "@lwce/store";

import Body from "app/body";

// The wire service has to be registered once
import { registerWireService } from 'wire-service';
registerWireService(register)

// Do not use native shadow DOM as it breaks bootstrap
import "@lwc/synthetic-shadow"

// Initialize the store with no initial content
setDebugStore(false);
initStore();

// Create a global fetch client pointing to the current server, within API
const fetchClient = new FetchClient('/api');
setFetchClient(fetchClient);

const main = createElement("app-body", { is: Body });
document.getElementById("main").appendChild(main);
