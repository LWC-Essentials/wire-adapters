/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
/**
 * Utility to help with the fetch API.
 *
 *   https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
declare type RequestInterceptor = (init?: RequestInit) => RequestInit | Promise<RequestInit>;
declare type ResponseInterceptor = (value: any, response: Response) => any | Promise<any>;
export declare class FetchClient {
    url: any;
    requestInterceptors: RequestInterceptor[];
    responseInterceptors: ResponseInterceptor[];
    constructor(url?: string);
    fetch(input: string, variables?: Record<string, any>, init?: RequestInit): Promise<Response>;
}
export declare function getFetchClient(): FetchClient | null;
export declare function setFetchClient(client: FetchClient | null): void;
export {};
