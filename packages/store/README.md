# @lwce/store

[![npm version](https://img.shields.io/npm/v/@lwce/store?style=flat)](https://www.npmjs.com/package/@lwce/store)

This library provides a global store use to manage shared component state.  It allows components to store their data globally and react then the data is updated, either programmatically or from another component.  


### Alternatives

Othes stores, like [Redux](https://redux.js.org/) or [MobX](https://mobx.js.org/) can be obviously used with LWC, but they require extra work from the developers. For example, as Redux deals with unmutable data, the reactive wire adapters cannot be used seamlessly.

On the other hands, the essentials store is tightly integrated with LWC, fully leveraging the [reactive membrane](https://github.com/salesforce/observable-membrane). It is compatible with any existing component.


## Global Store

The library features a single global store, holding entries referenced by a key. At anytime, one can retrieve an entry by key and manipulate its value.


### Entries

An entry in the store is more than just a piece of data, but is a set of values:   

```typescript
interface StoreEntry {
  loading: boolean     // Indicates if the object is being loaded
  data: any            // The actual value, cen be undefined
  error: string		   // The error message, if initialization failed
  initialized: boolean // If the object has already been initialized
}
```


### Accessing Entries

An entry in the store can be retrieved using:  
    `getEntry(key: string, initializer?: Initializer, mode?: Mode): StoreEntry`

If the entry already exists in the store, then it is returned as is. If the entry does not yet exist, then it is created and, unless the mode is set to `Mode.LAZY`, it gets initialized. `Mode.FORCE` forces the entry to reinitialize. 
 
Note that once an entry is created, it will stay in the store as the same object. Only its content can be modified.  
 
One can check if an entry exists in the store using the following function:    
    `hasEntry(key: string): boolean`

An entry can be reinitialized at any time, using:  
  `reinitialize(key: string, initializer?: Initializer): void`

### Initializing entries

Store entries are initialized using `initializers`, which return a synchronous value, or a `Promise` resolving to a value. During the initialization phase and until the `Promise` resolves, the entry has its state set to "loading". Afterward, the `data` and `error` data members are updated with the result of the initialization.  

Once the value is initialized, the `initialized` property is also set to `true` and stays as this forever.  A component can rely on this property to, for example, display a loading icon only the very first time the entry is loaded (not yet initialized), and keep display the existing data on further initialization.  

When initializing an object, the store calls the available initializers in order: the explicit one passed to `getEntry()` or `reinitialize ()`, and then the registered ones. It stops with the first one not returning `undefined`.

Initializers should be registered globally, before the store entries are accessed, using:  
  `registerInitializer(initializer: Initializer): void`   


### Serializing the store

To support Server Side Rendering in the future, all the store entries are maintained within a global object that can eventually be serialized as JSON. Similarly, the store can be initialized with a JSON payload.


## useStore

`useStore` is a wire adapter that references an object by key in the store. Multiple use of `useStore` with the same key will reference the same physical object. Because the wire adapters create a reactive membrane on these objects, all the components using the same object is the store will be notified of the changes.


### Use useStore

Bellow is the syntax for `useStore`:  
  `@wire(useStore,{key: 'mykey', initializer?: initializer, mode?: mode}) myvar;`
  
If `mode` is `Mode.FORCE`, then the entry will be reinitialized when the component is connected: this forces the data to refresh. If it is `Mode.LAZY`, then the entry will have to be initialized explicitly. This is useful when the data is not needed right away for rendering the component (ex: data needed for validation, lookup, ...). 


