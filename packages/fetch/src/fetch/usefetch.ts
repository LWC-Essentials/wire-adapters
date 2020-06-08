/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
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

interface DataCallback {
    (value: any): void;
}

//
// useFetch
//
export class useFetch {
    dataCallback: DataCallback

    connected = false
    pendingResult: Result
    init: RequestInit|undefined
    url: string|undefined
    queryParams: Record<string,any>|undefined
    variables: Record<string,any>|undefined
    lazy=false
    fetchCurrent=0;

    constructor(dataCallback: DataCallback) {
        this.dataCallback = dataCallback;
        this.pendingResult = {
            client: undefined as unknown as FetchClient, // Trick - when sent to the component, it will be defined
            loading:false,
            data: undefined,
            error: undefined,
            initialized: false,
            fetch: this.fetch.bind(this)
        }
    }

    update(config: Record<string, any>) {
        this.pendingResult.client = config.client || getFetchClient();
        if(!this.pendingResult.client) {
            throw new Error("No FetchClient is assigned");
        }
        this.url = config.url
        this.lazy = config.lazy
        this.init = config.init
        this.variables = config.variables;
        this.queryParams = config.queryParams;
        if(!this.lazy) {
            this.fetch();
        } else {
            this.sendUpdate();
        }
    }

    connect() {
        this.connected = true;
        this.sendUpdate();
    }

    disconnect() {
        this.connected = false;
    }

    sendUpdate() {
        if(this.connected) {
            // Make a copy to make the notification effective
            const o = Object.assign({},this.pendingResult);
            this.dataCallback(o);
        }
    }

    fetch( params?: FetchParams ): Promise<void> {
        if(this.url) {
            const _init = {...this.init, ...(params && params.init) };
            const _queryParams= {...this.queryParams, ...(params && params.queryParams) };
            const _variables = {...this.variables, ...(params && params.variables) };
            this.pendingResult.loading = true;
            const fetchIndex=++this.fetchCurrent;
            this.sendUpdate();
            try {
                return this.pendingResult.client.fetch(this.url,_init,_queryParams,_variables).then( (response) => {
                    return response.json();
                }).then( (json: any) => {
                    if(fetchIndex==this.fetchCurrent) {
                        Object.assign(this.pendingResult, {
                            loading: false,
                            data: json,
                            error: undefined,
                            initialized: true
                        })
                        this.sendUpdate();
                        return Promise.resolve();
                    }
                }).catch( (err: any) => {
                    if(fetchIndex==this.fetchCurrent) {
                        Object.assign(this.pendingResult, {
                            loading: false,
                            data: undefined,
                            error: (err && err.toString()) || "Error",
                            initialized: true
                        })
                        this.sendUpdate();
                        return Promise.resolve();
                    }
                });
            } catch (error) {
                if(fetchIndex==this.fetchCurrent) {
                    Object.assign(this.pendingResult, {
                        loading: false,
                        data: undefined,
                        error: error.toString(),
                        initialized: true
                    })
                    this.sendUpdate();
                    return Promise.resolve();
                }
            }
        }
        return Promise.reject()
    }

}
