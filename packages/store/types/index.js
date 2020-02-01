/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("./store/store");
exports.registerInitializer = store_1.registerInitializer;
exports.updateState = store_1.updateState;
exports.getStoreValues = store_1.getStoreValues;
exports.initStore = store_1.initStore;
exports.reinitialize = store_1.reinitialize;
exports.dispatch = store_1.dispatch;
var usestore_1 = require("./store/usestore");
exports.useStore = usestore_1.useStore;
//# sourceMappingURL=index.js.map