import { useUserStore } from '@/stores/user';
import { openAlert } from '@/utils/TsAlert';
import { useRouter } from 'vue-router';

export const useLogout = () => {
  const router = useRouter();
  const userStore = useUserStore();

  const logout = async () => {
    await userStore.logout();
    openAlert('成功退出登录');
    await router.push('/');
  };

  return logout;
};
