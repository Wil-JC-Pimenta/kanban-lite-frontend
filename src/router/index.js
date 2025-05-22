import { createRouter, createWebHistory } from 'vue-router'
import BoardsView from '../views/BoardsView.vue'
import BoardView from '../views/BoardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/boards'
  },
  {
    path: '/boards',
    name: 'boards',
    component: BoardsView
  },
  {
    path: '/boards/:id',
    name: 'board',
    component: BoardView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 