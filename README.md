# PF Object Viewer

## Considerations

### Implementation
* Vuetify 1.x version was used, even though the good looking, Material Design 2 based 2.x alpha is out.
I decided to go for 1.x since I'm no Vuetify expert (yet) and I don't know about 2.x bugs and stability status right now, 
I don't the technical test to break because of it.

* I thought about making a list for the objects, but then I realized if everything was going to be sorted, filtered and 
paginated, it should be a table. A table makes sense because you are making sure you applied the right sorting and filter,
you an also compare rows values. References: https://ux.stackexchange.com/questions/119962/confused-with-what-to-use-list-vs-table

* I started with the idea of using Vuex for handling the state (I know the challenge says so too), since I think its appropiate, 
given the complexities involved in handling the model: filters, sortings, searching and pagination. I also came up with
2 other ideas, because this project and job is really important for me, and I wanted to think and have alternatives. The 2 ideas
consisted in: 
1) An objects list component wich held the state locally and used just the objects from Vuex. This component
wasn't so good because having the whole model in the component was really messy, the component used Vuetify's component separatly.
2) The other component was an object list but also another component wich was a table. This table had the ability to
do everything, you could add inputs dynamically on the fly and it dynamically computed the component's type using the
"is:" and dynamic attributes with v-bind:="{}". It was pretty fun and seemed like a good idea, but the API/props
ended up being too big and too broad, the abstraction was too much and the component had more responsabilities than it should.

3) Finally I went for my first approach, using Vuex for managing the whole state and settings, and using Vuetify components
separatly.

You can check the code for the other 2 ideas in the other branch, called `experiments`.

* The most important thing I think is that I took the URL as the single source of truth, I think it's the best way to 
have a one-way data flow. Every input pushes a new route to the router and then the application will hydrate the settings 
like search, sorting and filter from the URL to Vuex, after some parsing.


* I think I understood the idea of polling data on an interval, but since every action is server-side in my implementation,
the only thing that the data polling does is fetching the objects with the current settings every 10 seconds. I understand
that if I handled the sorting client-side, the data polling would make more sense. I hope I got that right. I see the point of
having a state updating on a set interval for checking for updates.

* I used Vuex getters for just accessing some state properties, altough some say the state should be accessed directly
via mapState for example, some other say it's a good practice, because there is no way you can mutate the state accidentaly.
It also makes it easier to type, using mapGetters.

* Sometimes I call mutations directly, for setting a value for example, since no async operation must be done, its less verbose for small apps. 
In this project, anyways, I decided to call an action for calling the mutations. I think it depends on the person.

* I used the vue-wait plugin for managing loading states for fetching the objects and objects list. The pro is that 
you can access it globally from the view or the methods/computed properties. You can also ask if there is any loader
active in the whole application or use a kind of Regex to see if there is a loder active in a specific module.

* The Object Detail component needs to fetch the object every time by the URL/param object ID, because if the user refreshes 
and the detail was passed as a prop from the ObjectList, it won't work.

* I went for multiple select inputs for sorting on different values, since the column tables from Vuetify have a restriction
for 1 sorting column only, even though there is a hacky way to accomplish it: https://codepen.io/grishnyakov/pen/mawOXg

* I thought about using the TreeView for the Object Detail but it looks to hacky for a "normal user" of course.

* The router-link can't be accesed right now with right click or 3rd click, since it needs to be an <a>.

* I added a plugin for using Vuetify's toasts easily, it should be added globally but its local now.

* Since I didn't have the time because of my current work, there are several things that can and must be improved.
They are indicated with the "TODO:" keyword, and they are in the "Must do improvments" card in the Trello board.

* I was going to build a json-server Docker image but I didn't have the time to do it and I still lack experience with
Docker, even though I know the basics. I'm always learning and improving.

¡Thanks for reading and for the opportunity!

### Trello dashboard progress
https://trello.com/b/93A8QLtj/pf
### Installation
* If Docker and NPM install fails: `npm cache clean --force
                                          rm -rf ~/.npm
                                          # In the project folder:
                                          rm -rf node_modules
                                          rm -f package-lock.json`
                                          
* If NPM and Docker show a DNS related error, follow the steps: `https://development.robinwinslow.uk/2016/06/23/fix-docker-networking-dns/`                                          
                                          


### Misc
* Why it's great to use data-test attributes for testing, ref may change with the implementation: 
 https://medium.com/@colecodes/test-your-dom-with-data-attributes-44fccc43ed4b  
 https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change     
 
* Great and funny video (700+ pages presentation) about mock testing with Justin Searls: https://www.youtube.com/watch?v=Af4M8GMoxi4                                  

* TODO: I learned about how some things worked in Vuetify by looking at their tests:
https://github.com/vuetifyjs/vuetify/tree/master/packages/vuetify/test/unit/components

While I was doing this project, the new vue-dev-tools 5.0 version came out, what a great time to be alive! (`and to use VueJS`)

### JSON Server

I'm working on the setup, for now it must be installed like this:

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
sudo docker run -it -p 8080:8080 --rm --name pf-frontend --build-arg run=test
```
If anything goes wrong with Jest, run `jest --clearCache`

### Compiles, minifies and serves for production
```
sudo docker run -it -p 8080:8080 --rm --name pf-frontend --build-arg run=build
```

Disclaimer: warnings about core-js version are shown when running some commands, it's actually a Vue-CLI error and it was fixed 12 hours ago in 3.5.2 
            (I'm using 3.5.1 and I don't wanna risk a dirty update): https://github.com/vuejs/vue-cli/issues/3695

Given that I'm not Docker expert (yet), the tests (once they pass) will try to serve and it will fail. I'm working on it.

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

