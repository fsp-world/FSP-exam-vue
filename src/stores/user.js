import { defineStore } from 'pinia'
import { login as loginReq, logout as logoutReq, checkLogin as checkLoginReq } from '@/apis/auth'

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('user', {
    // 其他配置...
    state: () => {
        return {
            // 所有这些属性都将自动推断出它们的类型
            isLogin: false,
            username: '',
            isAdmin: false,
            avatar: ''
        }
    },
    getters: {
        getUser: () => {
            return {
                isLogin: this.isLogin,
                username: this.username,
                isAdmin: this.isAdmin,
                avatar: this.avatar,
            }
        },
    },
    actions: {
        async login(data) {
            try {
                let res = await loginReq(data)
                if (res.data.code === 0) {
                    this.isLogin = true
                    this.username = res.data.username
                    this.isAdmin = res.data.isAdmin
                    this.avatar = res.data.avatar
                    localStorage.setItem('fsp_token', res.data.token)
                }
                return res
            } catch (error) {
                console.error(error);
                return { code: 1, desc: '登录错误' }
            }
        },
        async logout() {
            try {
                let res = await logoutReq()
                switch (res.data.code) {
                    case 0:
                        this.isLogin = false
                        localStorage.removeItem('fsp_token')
                        break
                    case 1:
                        this.isLogin = false
                        break
                }
                return res
            } catch (error) {
                console.error('退出登录出现错误');
                console.error(error);
                return error
            }
        },
        async checkLogin() {
            try {
                let res = await checkLoginReq()
                if (res.data.code === 0) {
                    this.isLogin = true
                    this.username = res.data.username
                    this.isAdmin = res.data.isAdmin
                    this.avatar = res.data.avatar
                } else {
                    this.isLogin = false
                    this.avatar = res.data.avatar
                }
                return res
            } catch (error) {
                return { code: 1, desc: '错误' }
            }
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user',
                storage: localStorage, // 或者 sessionStorage
            },
        ],
    },
})