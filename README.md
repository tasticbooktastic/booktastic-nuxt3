# Booktastic

Booktastic is a platform for distributed local libraries.  This is the frontend client; the backend API
servers are [here](https://github.com/tasticbooktastic/booktastic-go) and [here](https://github.com/tasticbooktastic/booktastic-server).

It was originally forked from [Iznik](https://github.com/freegle/iznik-nuxt3), which is the platform used
by [Freegle](https://www.ilovefreegle.org) for online gifting.

License
=======

This code is licensed under the GPL v2 (see LICENSE file).  

# Development

Currently only tested on node v17.9.1 and npm v9.4.0.  Requires node v17 or later because it relies on fetch()
which hasn't yet been fully backported to v16.

Then install all the dependencies:
```
npm install --legacy-peer-deps
```

If running the Go API Server locally then set:

```
API_V1=http://localhost:8192/api
API_V2=http://localhost:8192/api
```

Then start the dev server:
```
npm run dev
```

This will serve up the site at [localhost:3002](http://localhost:3002).

It will watch for changes and do hot module reloading.  Occasionally you'll need to restart Vite when it doesn't 
pick up a change.

# Technologies

Briefly:
* [Nuxt 3](https://v3.nuxtjs.org/), which is [Vue 3](https://vuejs.org/) (so we get all
  that nice reactive stuff), with a standard folder layout, SSR/static site generation and Pinia as a replacement 
  for Vuex.
* [Bootstrap Vue Next](https://github.com/bootstrap-vue/bootstrap-vue-next/), which is Bootstrap v5 for Vue 3 / Nuxt 3.
* Continuous Delivery via Netlify.
* Capacitor app (not done for Booktastic yet).