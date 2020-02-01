# Sample Application

The sample application shows the different modules provided by the `wire-adapters` pack. To run the sample application, execute the following commands from the root project:  

```
yarn build
yarn start
```  

Then launch your browser with the following URL:
[http://localhost:3001/](http://localhost:3001/)

[![](http://img.youtube.com/vi/j2lWsQ8AfgY/0.jpg)](http://www.youtube.com/watch?v=j2lWsQ8AfgY "LWC Essentials")


## Main application

The navigation bar at the top of the page shows the different pages available.  
The application itself uses two store entries:  

  - `router`
    This is a simple router based on the global store. This is not meant to be a fully functional router, but more a demo on how to use the global store.
  - `user`
    Holds the information about the current user, as displayed in the navigation bar (top right, John Doe).  
  
The store management code is located within the `src/commerce` directory. It contains the store initializers as well as some business logic (calculations, ...).  


## Store

The page simulates an e-commerce cart, showing a list of products. The cart is persisted in the global store, and accessed by the components using `@wire(useStore)`.  

They are multiple components accessing the shared cart:  

  - `cart`
    Shows the cart content and let the user add/delete products, as well as changing the quantities. Note that the cart is initialized using a timeout promise, to simulate a call to a service and display the loading icon.
  - `carticon`
    The cart icon with the total count of products currently added to the cart.
  - `checkout`
    The checkout summary, showing the total cost, including the taxes and the shipping.
    
Each of these components re-render when the cart is updated, thanks to the membranes.


## Fetch

This page showcases how a component can easily fetch data from the server. It also shows how the data can be fetch based on component property value, and re-fetch when these values change.  

The loading icon is only displayed when the page is loading and not yet initialized, but not when the page has already been initialized. This prevents a flash when navigating between the data.  

Note that the user REST service has been voluntarily slowed down (delayed) by 300ms, to make the icon visible.  See: `/src-server/rest.js`.  


