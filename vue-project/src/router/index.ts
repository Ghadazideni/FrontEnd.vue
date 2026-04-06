import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore: Vue SFC import without a declaration file
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView }
  ]
})

export default router