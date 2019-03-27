# PF Object Viewer

## Considerations

### Implementation
Here lie 2 experiments that I came up with when I was doing the project. One Object List uses local state + Vuetify composed
components and the other uses an abstraction created by me, but it ended up having a big API and too broad and too coupled.
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

### Run your unit tests
```
npm run test:unit
```

Warnings about core-js version are shown, it's actually a Vue-CLI error and it was fixed 12 hours ago in 3.5.2 
(I'm using 3.5.1):
https://github.com/vuejs/vue-cli/issues/3695

If anything goes wrong with Jest, run `jest --clearCache`

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint --fix
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
