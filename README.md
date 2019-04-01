### Trello dashboard
https://trello.com/b/93A8QLtj/pf                           

### JSON Server

Necessary for running the API

`
npm install -g json-server`

Copy the `objects.json` file into a folder (`it's in this repository`), set the current directory as the folder and run
``
json-server objects.json
``

It will listen in port 3000.

# Docker setup

### Container build
```
sudo docker build -t pf-frontend . 
```

### Run unit tests
```
sudo docker run -it --rm -e ENVIRONMENT=test --name pf-frontend-tests pf-frontend
```
If anything goes wrong with Jest, run `jest --clearCache`

### Serves development server
```
sudo docker run -it --rm -p 8080:8080 -e ENVIRONMENT=serve --name pf-frontend-app pf-frontend
```

Available at: `http://localhost:8080`

Disclaimer: warnings about core-js version are shown when running some commands, it's actually a Vue-CLI error and it was fixed 12 hours ago in 3.5.2 

# Local setup (no Docker)
```
npm install
```

### Generates and serves the components documentation (in progress) 

Disabled temporarly since it breaks Docker build because of the "acorn" dependency.

```
npm run styleguide
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run unit tests
```
npm run test:unit
```



If anything goes wrong with Jest, run `jest --clearCache`

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint --fix
```

