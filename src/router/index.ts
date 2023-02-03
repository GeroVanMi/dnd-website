import { createRouter, createWebHistory } from 'vue-router'
import ProbabilityCalculator from "../views/ProbabilityCalculator.vue";
import Initiative from "../views/Initiative.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Initiative',
            component: Initiative,
        },
        {
            path: '/probability',
            name: 'Probabilities',
            component: ProbabilityCalculator,
        },
        // {
        //   path: '/about',
        //   name: 'about',
        //   // route level code-splitting
        //   // this generates a separate chunk (About.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import('../views/AboutView.vue')
        // }
    ]
})

export default router
