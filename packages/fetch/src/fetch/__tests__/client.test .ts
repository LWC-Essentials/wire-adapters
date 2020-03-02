'use strict';

import {FetchClient} from "@lwce/fetch"

describe('Compose final URL ', () => {
    it('Compose global URL', () => {
        const fc1 = new FetchClient("http://myserver.com");
        expect( fc1.composeUrl("api") ).toBe("http://myserver.com/api")
        expect( fc1.composeUrl("/api") ).toBe("http://myserver.com/api")
        const fc2 = new FetchClient("http://myserver.com/");
        expect( fc2.composeUrl("api") ).toBe("http://myserver.com/api")
        expect( fc2.composeUrl("/api") ).toBe("http://myserver.com/api")
    })
    // it('Substitute variables', () => {
    //     const fc1 = new FetchClient("http://myserver.com");
    //     fc.composeUrl("")
    // })
});

// describe('client ', () => {
//     const fc = new FetchClient();
//     it('Substitute variables', () => {
        
//     })
// });
