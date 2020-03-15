/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { register, ValueChangedEvent } from '@lwc/wire-service';
import { FetchClient, getFetchClient } from './client';

interface FetchParams {
    init?: RequestInit,
    queryParams?: Record<string, any>, 
    variables?: Record<string, any> 
}; 

interface Result {
    loading:        boolean;
    data?:          any;
    error?:         string;
    initialized:    boolean;

    client:         FetchClient;
    fetch?:         ( params?: FetchParams ) => Promise<void>;
}

//
// useFetch
//
export const useFetch = Symbol('use-fetch');

register(useFetch, eventTarget => {

    let connected=false,
        pendingResult: Result={
            client: undefined as unknown as FetchClient, // Trick - when sent to the component, it will be defined
            loading:false,
            data: undefined,
            error: undefined,
            initialized: false,
            fetch
        },
        init:RequestInit|undefined,
        url:string|undefined, 
        queryParams:Record<string,any>,
        variables:Record<string,any>,
        lazy=false,
        fetchCurrent=0;

    function update() {
        if(connected) {
            // Make a copy to make the notification effective
            const o = Object.assign({},pendingResult);
            eventTarget.dispatchEvent(new ValueChangedEvent(o));
        }
    }

    function fetch( params?: FetchParams ): Promise<void> {
        if(url) {
            const _init = {...init, ...(params && params.init) };
            const _queryParams= {...queryParams, ...(params && params.queryParams) };
            const _variables = {...variables, ...(params && params.variables) };
            pendingResult.loading = true;
            const fetchIndex=++fetchCurrent;
            update();
            try {
                return pendingResult.client.fetch(url,_init,_queryParams,_variables).then( (response) => {
                    return response.json();
                }).then( (json: any) => {
                    if(fetchIndex==fetchCurrent) {
                        Object.assign(pendingResult, {
                            loading: false,
                            data: json,
                            error: undefined,
                            initialized: true
                        })
                        update();
                        return Promise.resolve();
                    }
                }).catch( (err: any) => {
                    if(fetchIndex==fetchCurrent) {
                        Object.assign(pendingResult, {
                            loading: false,
                            data: undefined,
                            error: (err && err.toString()) || "Error",
                            initialized: true
                        })
                        update();
                        return Promise.resolve();
                    }
                });
            } catch (error) {
                if(fetchIndex==fetchCurrent) {
                    Object.assign(pendingResult, {
                        loading: false,
                        data: undefined,
                        error: error.toString(),
                        initialized: true
                    })
                    update();
                    return Promise.resolve();
                }
            }
        }
        return Promise.reject()
    }

    function handleConfig(options:any) {
        pendingResult.client = options.client || getFetchClient();
        if(!pendingResult.client) {
            throw new Error("No FetchClient is assigned");
        }
        url = options.url
        lazy = options.lazy
        init = options.init
        variables = options.variables;
        queryParams = options.queryParams;
        if(!lazy) {
            fetch();
        } else {
            update();
        }
    }

    function handleConnect() {
        connected = true;
        update();
    }

    function handleDisconnect() {
        connected = false;
        // We should cancel the fetch() if there
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout( () => {
            eventTarget.removeEventListener('disconnect', handleDisconnect);
            eventTarget.removeEventListener('connect', handleConnect);
            eventTarget.removeEventListener('config', handleConfig);
        });
    }

    // Connect the wire adapter
    eventTarget.addEventListener('config', handleConfig);
    eventTarget.addEventListener('connect', handleConnect);
    eventTarget.addEventListener('disconnect', handleDisconnect);
});
