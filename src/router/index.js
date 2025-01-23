import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main.vue'
import Guarantee from '@/views/Guarantee.vue'
import PrepareForTheExam from '@/views/PrepareForTheExam.vue'
import Examination from '@/views/Examination.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/guarantee',
      name: 'Guarantee',
      component: Guarantee
    },
    {
      path: '/prepareForTheExam',
      name: 'PrepareForTheExam',
      component: PrepareForTheExam
    },
    {
      path: '/examination',
      name: 'Examination',
      component: Examination
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('@/views/Auth.vue')
    }
  ],
})

export default router
