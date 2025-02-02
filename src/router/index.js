import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main.vue'
import Guarantee from '@/views/Guarantee.vue'
import PrepareForTheExam from '@/views/PrepareForTheExam.vue'
import Examination from '@/views/Examination.vue'
import { useUserStore } from '@/stores/user'


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
            component: Guarantee,
            meta: { requiresAuth: true }
        },
        {
            path: '/prepareForTheExam',
            name: 'PrepareForTheExam',
            component: PrepareForTheExam,
            meta: { requiresAuth: true }
        },
        {
            path: '/examination',
            name: 'Examination',
            component: Examination,
            meta: { requiresAuth: true }
        },
        {
            path: '/auth',
            name: 'Auth',
            component: () => import('@/views/Auth.vue')
        }
    ],
})

// 路由守卫：检查用户是否登录
router.beforeEach((to, from, next) => {
    console.log(to, from);
    // 检查目标路由是否需要登录
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // 检查用户是否已登录（假设登录状态存储在 localStorage 中）
        const store = useUserStore()
        if (!store.isLogin) {
            // 如果未登录，重定向到登录页面
            next({ name: 'Auth' });
        } else {
            // 如果已登录，继续导航
            next();
        }
    } else {
        // 如果目标路由不需要登录，直接继续导航
        next();
    }
})

export default router
