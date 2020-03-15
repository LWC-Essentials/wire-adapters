'use strict';

import {FetchClient} from "../../index"

describe('Compose final URL ', () => {
    it('Compose global URL', () => {
        const fc = new FetchClient("http://myserver.com");
        expect( fc.composeUrl("api") ).toBe("http://myserver.com/api")
        expect( fc.composeUrl("/api") ).toBe("http://myserver.com/api")
        expect( fc.composeUrl("http://server2/api") ).toBe("http://server2/api")
    })
    it('Query Parameters', () => {
        const fc = new FetchClient("http://myserver.com");
        expect( fc.composeUrl("/product",{d: 'aaa'}) ).toBe("http://myserver.com/product?d=aaa")
        const u = fc.composeUrl("/product",{c: 'bbb', d: 'aaa'});
        const bu = u==="http://myserver.com/product?c=bbb&d=aaa" || u==="http://myserver.com/product?d=aaa&c=bbb";
        expect(bu).toBeTruthy();
        expect( fc.composeUrl("/product?c=bbb",{d: 'aaa'}) ).toBe("http://myserver.com/product?c=bbb&d=aaa")
    })
    it('Substitute variables', () => {
        const fc = new FetchClient("http://myserver.com");
        expect( fc.composeUrl("/product/{id}",undefined,{id: 'xyz'}) ).toBe("http://myserver.com/product/xyz")
        expect( fc.composeUrl("/product/{a}?p={b}",undefined,{a: 'xyz', b: 'vvv'}) ).toBe("http://myserver.com/product/xyz?p=vvv")
    })
});
