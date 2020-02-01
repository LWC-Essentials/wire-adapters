# wire-adapters

wire-adapters is a collection of LWC utilities using wire adapters.

**Note #1:** *The LWC wire adapter API is subject to change (see: https://github.com/salesforce/lwc-rfcs/blob/master/text/0103-wire-adapters.md). The library currently uses the LWC wire adapter API 1.1.x.*

**Note #2:** *This library is under development and can change any time until it reaches version 1.0. Contributions as ideas or code are obviously welcome!*

The project is a mono-repo where each feature is defined in its own package. The packages are published on NPM within the `@lwce` org. A sample application is also provided to show the features in action.  

The currently available packages are the following:  
  
- [store](packages/store/README.md)  
  A mutable client side state container. It allows decoupled components to share data.
  
- [fetch](packages/fetch/README.md)  
  A `FetchClient` object, along with a `useFetch` wire adapter. It easily connects components to REST apis.  

  
  
Here is a video of the demo application:  

 [![](http://img.youtube.com/vi/j2lWsQ8AfgY/0.jpg)](http://www.youtube.com/watch?v=j2lWsQ8AfgY "LWC Essentials")
