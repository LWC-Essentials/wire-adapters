# TODO - wire-adapters

## Add unit tests

For both the store and fetch packages...


## Better use typescript

Verify that the types are properly used everywhere.  


## Store

Find a way to create a typescript component using the annotations (@wire), to avoid having to use a trick with a JS class.  

Moreover, is there a way to create a membrane that works with components, without having to create a fake component?


## FetchClient

### Use the cache (store)

The `FetchClient` results can be stored in the global store for caching, sharing and SSR purposes.  


### Test and finish the Interceptors implementation

Connect to an authenticated service and add the proper headers on the fly.  
