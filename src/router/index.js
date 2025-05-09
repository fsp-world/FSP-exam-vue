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
      redirect: { name: 'User' },
      component: () => import('@/views/Admin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
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
  ],
});

// 路由守卫
router.beforeEach((to, from) => {
  const user = useUserStore();

  // 如果用户已登录且尝试访问 Auth 页面，重定向到 Space 页面
  if (to.name === 'Auth' && user.isLogin) {
    return { name: 'Space' };
  }

  // 检查是否需要认证
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user.isLogin) {
      // 如果未登录，重定向到登录页面，并携带重定向路径
      return {
        name: 'Auth',
        query: { redirect: to.fullPath },
      };
    }

    // 检查是否需要管理员权限
    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      if (!user.isAdmin) {
        // 如果不是管理员，重定向到错误页面
        return {
          name: 'Error',
          query: { redirect: to.fullPath, message: '你不是管理员！' },
        };
      }
    }
  }

  // 默认情况下，允许导航
  return true;
});

export default router;
