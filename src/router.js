import Vue from 'vue';
import VueRouter from 'vue-router';

import loginScreem from './components/loginScreen.vue';
import MapPage from './components/map.vue';
import RegisterPage from './components/register.vue';


// import About from './views/About.vue';

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "Map",
    component: MapPage,
    meta: {
        requiresAuth: true, // Add this line to specify that the route requires authorization
    },
},
{
    path: '/login',
    name: 'loginScreem',
    component: loginScreem,
},
{
    path: '/register',
    name: 'register',
    component: RegisterPage,
},
];

const router = new VueRouter({
    mode: 'history', // Use history mode for clean URLs (requires server-side configuration)
    routes,
});

export default router;