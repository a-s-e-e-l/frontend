import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import * as VueGoogleMaps from 'vue2-google-maps'
import GMapAutocomplete from 'vue2-google-maps/dist/components/autocomplete'
import Polyline from 'vue2-google-maps/dist/components/polyline.js' // replace src with dist if you have Babel issues
// replace src with dist if you have Babel issues
import router from './router';

import axios from "axios";


function isUserAuthenticated() {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      const head = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
  
      axios.get('http://localhost:5000/api/', head)
        .then(response => {
          if (response.data.message) {
            console.log(response.data.message);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }

  router.beforeEach(async (to, from, next) => {
    // Check if the route requires authorization
    if (to.matched.some(route => route.meta.requiresAuth)) {
      try {
        // Call isUserAuthenticated() and wait for the promise to resolve
        const authenticated = await isUserAuthenticated();
  
        if (authenticated) {
          // User is authenticated, proceed to the route
          next();
        } else {
          // User is not authenticated, redirect to the login page or any other page you prefer
          next("/login");
        }
      } catch (error) {
        console.error(error);
        // Handle the error, for example, redirect to an error page
        next("/login");
      }
    } else {
      // Route does not require authorization, proceed to the route
      next();
    }
  });
  

Vue.component('GMapAutocomplete', GMapAutocomplete)
Vue.component('GMapPolyline', Polyline)


Vue.config.productionTip = false

Vue.use(VueGoogleMaps, { //use vue2-google-map to display maps with some feature (marker, infowindow, etc)
    load: {
        key: 'AIzaSyDEsOm9JwBayoz_CuJIslL3ume-ZE8h2B0',
        libraries: 'places',
        //the key generated when register project free trial on google maps JS API
    },
}),

    new Vue({
        router: router, // Use the first router instance
        vuetify, // Use the vuetify plugin
        render: (h) => h(App),
    }).$mount('#app');