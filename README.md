# PF Object Viewer

## Considerations

* Vuetify 1.x version was used, even though the good looking, Material Design 2 based 2.x alpha is out.
<br>
I decided to go for 1.x since I'm no Vuetify expert (yet) and I don't know about 2.x bugs and stability status right now, 
and I don't want the application and the technical test to break because of it.

* I used the List component for the objects list and not the Table because I won't assume that every object is going to 
have the same structure and properties (column names in a table). I assume the object will have an ID, title and 
description for simplicity and for the sake of this test.

* ObjectDetail component needs to fetch the object every time by the URL/param object ID, because if the user refreshes 
and the detail was 
passed as a prop from the ObjectList, it won't work.

* TODO: Considerations on using Vuex for handling paging, filtering and sorting

* TODO: Considerations over data poll from a store, avoid having 2 sources of truth

* TODO: Consideration over accesing state and getters that generate overhead

* TODO: Use of commit and skipping actions for synchronous state operations, avoid verbosity for small apps

* TODO: Considerations of vue-wait and the pros

* TODO: Considerations on patterns for updating vuex based on URL as single source of truth

* TODO: Considerations on Docker and NPM if install fails: `npm cache clean --force
                                          rm -rf ~/.npm
                                          # In the project folder:
                                          rm -rf node_modules
                                          rm -f package-lock.json`
                                          
* Why its great to use data-test attributes for testing: 
 https://medium.com/@colecodes/test-your-dom-with-data-attributes-44fccc43ed4b  
 https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change     
 
 * Great and funny video about mock testing by Justin Searls: https://www.youtube.com/watch?v=Af4M8GMoxi4                                  
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
