/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

const path = require('path');

// Rollup with external depenceies, like apollo-boost
//   https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency

const replace = require('rollup-plugin-replace');
const lwcCompiler = require('@lwc/rollup-plugin');
const compat = require('rollup-plugin-compat');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');
//const commonjs = require('rollup-plugin-commonjs');

const syntheticShadow = require('./synthetic-shadow');

const env = process.env.NODE_ENV || 'development';

const input = path.resolve(__dirname, '../src/main.js');
const outputDir = path.resolve(__dirname, '../public/js');

function rollupConfig({ target }) {
    const isCompat = target === 'es5';
    const isProduction = env === 'production';

    return {
        input,
        output: {
            file: path.join(outputDir, (isCompat ? 'lwc-components-compat' : 'lwc-components') + (isProduction ? ".min.js" : ".js")),
            format: 'iife',
        },
        plugins: [
            resolve({
                mainFields: ['module', 'main'],
                browser: true,
            }),
            isCompat && syntheticShadow(),
            lwcCompiler(),
            replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
            isCompat && compat(),
            isProduction && terser()
        ].filter(Boolean)
    }
}

module.exports = [
    //rollupConfig({ target: 'es5' }),
    rollupConfig({ target: 'es2017' })
];
