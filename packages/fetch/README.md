# @lwce/fetch

This library allows LWC components to connect to REST services using an easy syntax wrapping the browser `fetch()` method.


## useFetch

`useFetch` is a simple wire adapter that executes an HTTP request and assigns the result to a component property:  

```javascript
    @wire(useFetch, options) myproperty;
```

The options are the following:  

  - `url`: the fetch URL.  
  If this URL is relative, then it is appended to the `FetchClient` base URL (see bellow).  
  - `init`: the options passed to the fetch method (a [RequestInit](https://fetch.spec.whatwg.org/#requestinit) object).  
  - `variables`: substitution variables.  
  The URL parts between `{}` are substituted by these variables. It also applies to the `body` member of `init`, if any.  

Here is an example:  

```javascript
export default class UserList extends LightningElement {

    @track variables = {
        offset: 0,
        limit: 10
    }

    @wire(useFetch, {
        url: '/users?offset={offset}&limit={limit}',
        variables: '$variables'
    }) users;
```

Note: to make the wire adapter react on a variable value change, the whole `variables` object has to be replaced, as a change in a property is not detected. For example, changing the offset should be done with code like:  

```javascript
	 // Right way to update an object
    handleFirst() {
        this.variables = {
            ...this.variables,
            offset: 0
        }
    }
    
//    // This does not trigger a wire adapter change!
//    handleFirst() {
//        this.variables.offset = 0;
//    }
```  


### Fetch Result

The fetch wire adapter assigns the following values to the variable:  

```javascript
    loading:        boolean;			// true when the request is excuting
    data?:          any;				// Result if the request was succesful
    error?:         string;			// Error message if an error occurred
    initialized:    boolean;			// true of the request has been executed at least once	

    client:         FetchClient,		// FetchClient used for the request
    fetch?:         (options, v)		// fetch() method to re-execute the request (see 'lazy')
```



### FetchClient

Behind the scene, `useFetch` uses a `FetchClient` instance that holds a base URL, and can intercept the requests/responses (see bellow). By default, it uses a default `FetchClient`, registered as a global singleton. But an explicit client can be passed a parameter if needed:  

```javascript
    @wire(useFetch, {
    	client: myFetchClient,
    	...
    }) mydata;
```


### Fetch URL

The `url` parameter of `useFetch` is relative to the `FetchClient` being used, unless it is itself absolute. Note that using an absolute URL within the components is not considered as a good practice, as it statically points to a server.  

If the URL is more complex to build, then it can be defined as a component property and calculated when needed:  

```javascript
    @track url
    @wire(useFetch, {
       url: '$url',
		...        
    }) mydata;
```


### Fetch options (init)

Behind the scene, the wire adapter uses the browser [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to execute the query. The `fetch()` function uses options that are set with the top level property `fetchOptions`:  

```javascript
    @wire(useFetch, {
    	init: {
          method: 'POST',
          ...
       },
		...        
    }) mydata;
```

Note that some of these options (authentication headers, cors mode, cache...) should better be set at the `FetchClient` level, so it is shared by all the wire adapters using the same `FetchClient` instance.


### Lazy mode

The request is automatically emitted when the wire adapter config is available, which means when the component is connected to the DOM. This works well for data needed by the component to display right away but, sometimes, the request should be executed manually. This is certainly true for update requests (POST,PUT,DELETE) and for data requested on demand (list for a pop-up, ...). To support that, the wire adapter offers a 'lazy' mode. When set to true, the request is only executed with an explicit call the `fetch()`.  

The fetch method has the following signature:  

```javascript
    fetch(init?: RequestInit, variables?: Record<string, any>): void
``` 
- init  
  These are initialization parameters that are merged with the ones defined at the adapter level.  
- variables  
  Replaces (no merge) the variables defined at the wire adapter level.  

Here is an example:   

```javascript
    @wire(useFetch, {
    	lazy: true
		 ...        
    }) mydata;
    
    handleClick() {
    	// Explicitly fetch the data
    	this.mydata.fetch()
    }
```


### Current limitations

`useFetch` does not use a store behind the scene, which means that the request results are not cached and shared between adapters. Such a cache should better be implemented at the `FetchClient` level.


## FetchClient

***Some enhancements have to be made to this class so it will change over time***

`FetchClient` is a javascript class to help with calling the `fetch()` standard method. It includes:
  
  - A base url.  
    This will be prepended to any no absolute urls used in the `fetch()` method.  
  - An array of `RequestInterceptor`
    Request interceptors can be used to update the `options` used by the browser `fetch()` method. A request interceptor can return a new object with the options, or a Promise resolving to this object.
  - An array of `ResponseInterceptor`
    response interceptors can be used to process the response. They return a Promise with the processed result.  
    
    
### Global client

The module exports two methods to get and set a global, shared `FetchClient` (singleton). It is used by `useFetch` when no explicit client is passed as a parameter.
