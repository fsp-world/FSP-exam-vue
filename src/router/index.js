import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('@/views/Main.vue'),
    },
    {
      path: '/guarantee',
      name: 'Guarantee',
      component: () => import('@/views/Guarantee.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/prepareForTheExam',
      name: 'PrepareForTheExam',
      component: () => import('@/views/PrepareForTheExam.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/examination/:sid',
      name: 'Examination',
      component: () => import('@/views/Examination.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reset_password',
      name: 'ResetPassword',
      component: () => import('@/views/ResetPassword.vue'),
    },
    {
      path: '/activation',
      name: 'Activation',
      component: () => import('@/views/Activation.vue'),
    },
    {
      path: '/resourceCenter',
      name: 'ResourceCenter',
      component: () => import('@/views/ResourceCenter.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/query',
      name: 'Query',
      redirect: { name: 'QueryExamination' },
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
      ],
    },
    {
      path: '/space',
      name: 'Space',
      component: () => import('@/views/Space.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/user-settings',
      name: 'UserSettings',
      component: () => import('@/views/UserSettings.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/auth',
      name: 'Auth',
      redirect: { name: 'Login' },
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
        {
          path: 'find_password',
          name: 'FindPassword',
          component: () => import('@/components/form/FindPassword.vue'),
        },
      ],
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/Admin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/components/admin/Dashboard.vue'),
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('@/components/admin/User.vue'),
        },
        {
          path: 'whitelist',
          name: 'Whitelist',
          component: () => import('@/components/admin/Whitelist.vue'),
        },
        {
          path: 'exam',
          name: 'Exam',
          component: () => import('@/components/admin/Exam.vue'),
        },
        {
          path: 'guarantee_mgmt',
          name: 'GuaranteeMgmt',
          component: () => import('@/components/admin/GuaranteeMgmt.vue'),
        },
        {
          path: 'response',
          name: 'Response',
          component: () => import('@/components/admin/Response.vue'),
        },
        {
          path: 'slot',
          name: 'Slot',
          component: () => import('@/components/admin/Slot.vue'),
        },
        {
          path: 'config',
          name: 'Config',
          component: () => import('@/components/admin/Config.vue'),
        },
      ],
    },
    {
      path: '/error',
      name: 'Error',
      component: () => import('@/views/Error.vue'),
    },
    {
      path: '/online-stats',
      name: 'OnlineStats',
      component: () => import('@/views/OnlineStats.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: { name: 'Error', query: { message: '页面未找到', code: '404' } },
    },
  ],
});

// 路由守卫
router.beforeEach((to, from) => {
  const user = useUserStore();

  if (to.name === 'Auth' && user.isLogin) {
    return { name: 'Space' };
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !user.isLogin) {
    return {
      name: 'Auth',
      query: { redirect: to.fullPath },
    };
  }

  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  if (requiresAdmin && !user.isAdmin) {
    return {
      name: 'Error',
      query: { redirect: to.fullPath, message: '你不是管理员！' },
    };
  }

  return true;
});

export default router;
