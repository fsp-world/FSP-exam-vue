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
            path: '/query',
            name: 'Query',
            redirect: {name: 'QueryExamination'},
            component: () => import('@/views/Query.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'examination',
                    name: 'QueryExamination',
                    component: () => import('@/components/ExamList.vue'),
                },
                {
                    path: 'guarantee',
                    name: 'QueryGuarantee',
                    component: () => import('@/components/GuaranteeResult.vue'),
                },
            ]
        },
        {
            path: '/space',
            name: 'Space',
            component: () => import('@/views/Space.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/auth',
            name: 'Auth',
            redirect: {name: 'Login'},
            component: () => import('@/views/Auth.vue'),
            children: [
                {
                    path: 'login',
                    name: 'Login',
                    component: () => import('@/components/form/LoginForm.vue'),
                },
                {
                    path: 'register',
                    name: 'Register',
                    component: () => import('@/components/form/RegisterForm.vue'),
                },
            ]
        }
    ],
})

// 路由守卫：检查用户是否登录
router.beforeEach((to, from, next) => {
    const user = useUserStore()
    // 如果用户已登录且尝试访问登录页面，则重定向到个人空间
    if (to.name === 'Auth' && user.isLogin) {
        next({ name: 'Space' }); // 跳转到个人空间
    }
    // 检查目标路由是否需要登录
    else if (to.matched.some((record) => record.meta.requiresAuth)) {
        // 检查用户是否已登录
        if (!user.isLogin) {
            // 如果未登录，重定向到登录页面
            next({
                name: 'Auth',
                query: { redirect: to.fullPath },
            });
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
