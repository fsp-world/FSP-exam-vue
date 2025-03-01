import { defineStore } from 'pinia';
import {
  login as loginReq,
  logout as logoutReq,
  checkLogin as checkLoginReq,
  register as registerReq,
} from '@/apis/auth';

import { getUserInfo, setUserAvatar } from '@/apis/user';
import { getProfilePic } from '@/apis/mj';

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('user', {
  // 其他配置...
  state: () => ({
    // 所有这些属性都将自动推断出它们的类型
    isLogin: false,
    id: 0,
    username: '',
    isAdmin: false,
    avatar: '',
    avatarUUID: '',
    userQQ: '',
    role: '',
    addtime: '',
    status: 0,
  }),
  getters: {
    getStatus: (state) => {
      return state.status == 0 ? '未激活' : state.status == 1 ? '正常' : '封禁';
    },
    dateToLocal: (state) => {
      let date = new Date(state.addtime);
      return `${date.getFullYear()}年 ${date.getMonth() + 1} 月 ${date.getDate()} 日 ${date.getHours()}时`;
    },
  },
  actions: {
    async login(data) {
      try {
        let res = await loginReq(data);
        if (res.data.code === 0) {
          this.isLogin = true;
          this.username = res.data.username;
          this.isAdmin = res.data.isAdmin;
          this.avatarUUID = res.data.avatar;
          let { imgUrl } = await getProfilePic(this.avatarUUID);
          this.avatar = imgUrl;
          localStorage.setItem('fsp_token', res.data.token);
        }
        return res;
      } catch (error) {
        console.error(error);
        return { code: 1, desc: '登录错误' };
      }
    },
    async register(data) {
      try {
        let res = await registerReq(data);
        if (res.data.code === 0) {
          this.isLogin = true;
          this.username = res.data.username;
          this.isAdmin = res.data.isAdmin;
          this.avatarUUID = res.data.avatar;
          let { imgUrl } = await getProfilePic(this.avatarUUID);
          this.avatar = imgUrl;
          localStorage.setItem('fsp_token', res.data.token);
        }
        return res;
      } catch (error) {
        console.error(error);
        return { code: 1, desc: '错误' };
      }
    },
    async logout() {
      try {
        let res = await logoutReq();
        switch (res.data.code) {
          case 0:
            this.isLogin = false;
            localStorage.removeItem('fsp_token');
            break;
          case 1:
            this.isLogin = false;
            break;
        }
        return res;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    async checkLogin() {
      try {
        let res = await checkLoginReq();
        if (res.data.code === 0) {
          this.isLogin = true;
          this.username = res.data.username;
          this.isAdmin = res.data.isAdmin;
          this.avatarUUID = res.data.avatar;
          let { imgUrl } = await getProfilePic(this.avatarUUID);
          this.avatar = imgUrl;
        } else {
          this.isLogin = false;
        }
        return res;
      } catch (error) {
        console.error(error);
        return { code: 1, desc: '错误' };
      }
    },
    async setAvatar(uuid) {
      try {
        let res = await setUserAvatar(uuid);
        if (res.data.code === 0) {
          this.avatarUUID = uuid;
          let { imgUrl } = await getProfilePic(this.avatarUUID);
          this.avatar = imgUrl;
        }
        return res;
      } catch (error) {
        console.error(error);
        return { code: 1, desc: '错误' };
      }
    },
    async syncUserInfo() {
      try {
        let { data } = await getUserInfo();
        this.id = data.data.id;
        this.username = data.data.username;
        this.avatarUUID = data.data.avatar;
        this.addtime = data.data.addtime;
        this.role = data.data.role;
        this.userQQ = data.data.user_qq;
        let { imgUrl } = await getProfilePic(this.avatarUUID);
        this.avatar = imgUrl;
      } catch (error) {
        console.error(error);
        return { code: 1, desc: '错误' };
      }
    },
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
});
