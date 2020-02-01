/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
type RequestInterceptor = (init?: RequestInit) => RequestInit|Promise<RequestInit>;
type ResponseInterceptor = (value: any, response: Response) => any|Promise<any>;

function substitute(template: string, variables: Record<string,string>) {
    return template.replace(/\{(.*?)}/g, (_, i) => variables[i]);
}

export class FetchClient {

    url: string;
    requestInterceptors: RequestInterceptor[] = [];
    responseInterceptors: ResponseInterceptor[] = [];

    constructor(url?:string) {
        if(!url || url.indexOf(':')<0) {
            url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + (url || '');
        }
        this.url = url;
    }

    addRequestInterceptor(interceptor: RequestInterceptor) {
        this.requestInterceptors.push(interceptor);
    }

    addResponseInterceptor(interceptor: ResponseInterceptor) {
        this.responseInterceptors.push(interceptor);
    }

    async fetch(input: string, init?: RequestInit, variables?:Record<string, any>): Promise<Response> {
        // Concat the base URL if not absolute
        if(this.url && input.indexOf('://')<0) {
            input = `${this.url}${input}`;
        }

        // Substitute the variables
        if(variables) {
            input = substitute(input,variables);
            if(init) {
                if(typeof init.body==='string') {
                    input = substitute(input,variables);
                }
            }
        }
 
        // Process the request interceptors
        const reqI = this.requestInterceptors;
        if(reqI && reqI.length) {
            // Make a copy of the initialization object as it can be processed
            init = Object.assign({},init);
            for(let i=0; i<reqI.length; i++) {
                const r = reqI[i](init);
                if(r && (r as Promise<RequestInit>).then) {
                    init = await (r as Promise<RequestInit>);
                } else {
                    init = r as RequestInit;
                }
            }
        }

        // Fetch the data
        const response = await fetch(input,init);
        let value = response;

        // Process the response
        const resI = this.responseInterceptors;
        if(resI && resI.length) {
            for(let i=0; i<resI.length; i++) {
                const r = resI[i](value,response);
                if(r && (r as Promise<any>).then) {
                    value = await (r as Promise<any>);
                }
            }
        }
        
        return value;
    }
}


const FETCHKEY = "__lwce_fetch__";

export function getFetchClient() {
    return (window as any)[FETCHKEY];
}

export function setFetchClient(client: FetchClient|null) {
    return (window as any)[FETCHKEY] = client;
}
