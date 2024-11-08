import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';

// Define the type of route
interface Route {
    path: string;
    component: any; // Can be more strictly defined according to the actual component type
}

const routes: Route[] = [
    {
        path: '/',
        component: Home,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;