import { createRouter, createWebHistory } from 'vue-router'

import AboutView from '../views/AboutView.vue'
import TimelineView from '../views/TimelineView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'timeline', component: TimelineView },
    { path: '/about', name: 'about', component: AboutView },
  ],
})
