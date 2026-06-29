import { defineStore } from 'pinia';
import type { User } from '@/types';
import {
  login as loginReq,
  logout as logoutReq,
  checkLogin as checkLoginReq,
  register as registerReq,
} from '@/apis/auth';

import { getUserInfo, setUserAvatar, setUserBackground } from '@/apis/user';
import { getProfilePic } from '@/apis/mj';
import { computStatus, getUserJoinSeason } from '@/utils/statusUtil';
import { dateFormatYYYYMMDD } from '@/utils/date';

export const roleMap: Record<string, string> = {
  admin: '管理',
  helper: '协管',
  user: '用户',
};

export const useUserStore = defineStore('user', {
  state: (): User => ({
    // 所有这些属性都将自动推断出它们的类型
    isLogin: false,
    id: 0,
    username: '',
    isAdmin: false,
    avatar: '',
    avatarUUID: '',
    userQQ: '',
    role: 'user',
    addtime: '',
    status: 0,
    playPermission: false,
    background: '',
  }),
  getters: {
    getStatus: (state) => {
      return computStatus(state.status);
    },
    dateToLocal: (state) => {
      return dateFormatYYYYMMDD(state.addtime);
    },
    getJoinSeason: (state) => {
      return getUserJoinSeason(state.addtime);
    },
    roleText: (state) => {
      return roleMap[state.role] || '未知角色';
    },
    bgImg: (state) => {
      return state.background || undefined;
    },
  },
  actions: {
    async login(data: any) {
      try {
        let res = await loginReq(data);
        if (res.data.code === 0) {
          this.isLogin = true;
          this.username = res.data.username;
          this.isAdmin = res.data.isAdmin;
          this.avatarUUID = res.data.avatar;
          const { imgUrl } = await getProfilePic(this.avatarUUID);
          this.avatar = imgUrl || this.avatar;
          this.playPermission = res.data.play_permission;
          localStorage.setItem('fsp_token', res.data.token);
        }
        return res;
      } catch (error) {
        console.error(error);
        return { code: 1, desc: '登录错误' };
      }
    },
    async register(data: any) {
      try {
        let res = await registerReq(data);
        if (res.data.code === 0) {
          this.isLogin = true;
          this.username = res.data.username;
          this.isAdmin = res.data.isAdmin;
          this.avatarUUID = res.data.avatar;
          const { imgUrl } = await getProfilePic(this.avatarUUID);
          this.avatar = imgUrl || this.avatar;
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
          this.avatarUUID = res.data.avatar;
          this.username = res.data.username;
          this.isAdmin = res.data.isAdmin;
          this.playPermission = res.data.play_permission;
        } else {
          this.isLogin = false;
          this.avatarUUID = res.data.avatar;
        }

        const { imgUrl } = await getProfilePic(this.avatarUUID);
        this.avatar = imgUrl || this.avatar;

        return res;
      } catch (error) {
        console.error(error);
        return { code: 1, desc: '错误' };
      }
    },
    async setAvatar(uuid: string) {
      try {
        let res = await setUserAvatar(uuid);
        if (res.data.code === 0) {
          this.avatarUUID = uuid;
          const { imgUrl } = await getProfilePic(this.avatarUUID);
          this.avatar = imgUrl || this.avatar;
        }
        return res;
      } catch (error) {
        console.error(error);
        return { code: 1, desc: '错误' };
      }
    },
    setUsernameAction(newUsername: string) {
      this.username = newUsername;
    },
    async setBackground(bgUrl: string) {
      try {
        let res = await setUserBackground(bgUrl);
        if (res.data.code === 0) {
          this.background = bgUrl;
          if (bgUrl) {
            document.documentElement.style.setProperty(
              '--bg-img',
              `url('${bgUrl}')`,
            );
          } else {
            document.documentElement.style.removeProperty('--bg-img');
          }
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
        if (data.code === 0) {
          this.id = data.data.id;
          this.username = data.data.username;
          this.avatarUUID = data.data.avatar;
          this.addtime = data.data.addtime;
          this.role = data.data.role;
          this.userQQ = data.data.user_qq;
          this.status = data.data.status;
          const { imgUrl } = await getProfilePic(this.avatarUUID);
          this.avatar = imgUrl || this.avatar;
          this.playPermission = data.data.play_permission;
        }
      } catch (error) {
        console.error(error);
        return { code: 1, desc: '错误' };
      }
    },
  },
  persist: {
    key: 'user',
    storage: localStorage,
    paths: [
      'username',
      'avatarUUID',
      'avatar',
      'isLogin',
      'isAdmin',
      'addtime',
      'background',
    ], // 只持久化部分字段
  },
});
