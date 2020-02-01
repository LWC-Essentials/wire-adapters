/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
module.exports = {
    preset: '@lwc/jest-preset',
    moduleNameMapper: {
        '^(todo)/(.+)$': '<rootDir>/src/$1/$2/$2'
    },
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/test/specs/'
    ]
};
