import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Main",
            component: () => import('@/views/Main.vue'),
        },
        {
            path: "/guarantee",
            name: "Guarantee",
            component: () => import('@/views/Guarantee.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: "/prepareForTheExam",
            name: "PrepareForTheExam",
            component: () => import('@/views/PrepareForTheExam.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: "/examination",
            name: "Examination",
            component: () => import('@/views/Examination.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: "/query",
            name: "Query",
            redirect: { name: "QueryExamination" },
            component: () => import("@/views/Query.vue"),
            meta: { requiresAuth: true },
            children: [
                {
                    path: "examination",
                    name: "QueryExamination",
                    component: () => import("@/components/ExamList.vue"),
                },
                {
                    path: "guarantee",
                    name: "QueryGuarantee",
                    component: () => import("@/components/GuaranteeResult.vue"),
                },
            ],
        },
        {
            path: "/space",
            name: "Space",
            component: () => import("@/views/Space.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/auth",
            name: "Auth",
            redirect: { name: "Login" },
            component: () => import("@/views/Auth.vue"),
            children: [
                {
                    path: "login",
                    name: "Login",
                    component: () => import("@/components/form/LoginForm.vue"),
                },
                {
                    path: "register",
                    name: "Register",
                    component: () =>
                        import("@/components/form/RegisterForm.vue"),
                },
            ],
        },
        {
            path: "/admin",
            name: "Admin",
            redirect: { name: "User" },
            component: () => import("@/views/Admin.vue"),
            meta: { requiresAuth: true, requiresAdmin: true },
            children: [
                {
                    path: "user",
                    name: "User",
                    component: () => import("@/views/admin/User.vue"),
                },
                {
                    path: "whitelist",
                    name: "Whitelist",
                    component: () => import("@/views/admin/Whitelist.vue"),
                },
                {
                    path: "exam",
                    name: "Exam",
                    component: () => import("@/views/admin/Exam.vue"),
                },
                {
                    path: "guara",
                    name: "Guara",
                    component: () => import("@/views/admin/Guara.vue"),
                },
            ],
        },
        {
            path: "/error",
            name: "Error",
            component: () => import("@/views/Error.vue")
        },
    ],
});

// 路由守卫：检查用户是否登录
router.beforeEach((to, from, next) => {
    const user = useUserStore();
    // 如果用户已登录且尝试访问登录页面，则重定向到个人空间
    if (to.name === "Auth" && user.isLogin) {
        next({ name: "Space" }); // 跳转到个人空间
    }
    // 检查目标路由是否需要登录
    else if (to.matched.some((record) => record.meta.requiresAuth)) {
        // 检查用户是否已登录
        if (!user.isLogin) {
            // 如果未登录，重定向到登录页面
            next({
                name: "Auth",
                query: { redirect: to.fullPath },
            });
            // 检查目标路由是否需要管理员权限
        } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
            // 检查用户是否已登录
            if (!user.isAdmin) {
                // 如果不是，重定向到错误页面
                next({
                    name: "Error",
                    query: { redirect: to.fullPath, message: '你不是管理员！' },
                });
            } else {
                // 如果是，继续
                next();
            }
        }else {
            next();
        }
    } else {
        // 如果目标路由不需要登录，直接继续导航
        next();
    }
});

export default router;
