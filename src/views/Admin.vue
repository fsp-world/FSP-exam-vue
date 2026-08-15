<script lang="ts" setup>
import { ref, watch, useTemplateRef } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { LOGOUT_MESSAGES } from '@/constants/messages';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// 路由变化时关闭移动菜单
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  }
);

// ==================== 侧边栏 ====================
const isCollapse = ref(false);
const mobileMenuOpen = ref(false);

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

interface MenuItem {
  index: string;
  icon: string;
  title: string;
  children?: { index: string; title: string }[];
}

const menuData: MenuItem[] = [
  {
    index: '1',
    icon: 'dashboard',
    title: '仪表盘',
    children: [{ index: '/admin/dashboard', title: '仪表盘' }],
  },
  {
    index: '2',
    icon: 'monitor',
    title: '系统管理',
    children: [{ index: '/admin/config', title: '系统配置' }],
  },
  {
    index: '3',
    icon: 'user',
    title: '用户管理',
    children: [
      { index: '/admin/user', title: '用户列表' },
      { index: '/admin/whitelist', title: '白名管理' },
      { index: '/admin/guarantee_mgmt', title: '担保管理' },
    ],
  },
  {
    index: '4',
    icon: 'box',
    title: '试卷管理',
    children: [
      { index: '/admin/exam', title: '试卷列表' },
      { index: '/admin/slot', title: '试卷发布' },
      { index: '/admin/response', title: '答卷管理' },
    ],
  },
];

// 当前展开的子菜单
const openedSubMenu = ref('');
// 初始化时根据当前路由展开对应子菜单
const initOpenedMenu = () => {
  for (const menu of menuData) {
    if (menu.children?.some((child) => child.index === route.path)) {
      openedSubMenu.value = menu.index;
      return;
    }
  }
};
initOpenedMenu();

// 路由变化时自动展开对应菜单
watch(
  () => route.path,
  () => {
    for (const menu of menuData) {
      if (menu.children?.some((child) => child.index === route.path)) {
        openedSubMenu.value = menu.index;
        return;
      }
    }
  }
);

const toggleSubMenu = (index: string) => {
  openedSubMenu.value = openedSubMenu.value === index ? '' : index;
};

const isActiveMenu = (path: string) => route.path === path;

const isMenuGroupActive = (menu: MenuItem) => {
  return menu.children?.some((child) => child.index === route.path) ?? false;
};

// ==================== 用户下拉菜单 ====================
const showUserDropdown = ref(false);
const dropdownStyle = ref<Record<string, string>>({});

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value;
  if (showUserDropdown.value && userDropdownRef.value) {
    const rect = userDropdownRef.value.getBoundingClientRect();
    dropdownStyle.value = {
      position: 'fixed',
      top: rect.bottom + 8 + 'px',
      right: window.innerWidth - rect.right + 'px',
    };
  }
};

const closeUserDropdown = () => {
  showUserDropdown.value = false;
};

const onUserMenuClick = async (command: string) => {
  showUserDropdown.value = false;
  if (command === 'logout') {
    const confirmed = window.confirm(LOGOUT_MESSAGES.CONFIRM);
    if (confirmed) {
      localStorage.removeItem('gx-token');
      router.replace('/login');
    }
  } else {
    router.push(command);
  }
};

// 点击外部关闭下拉菜单
const userDropdownRef = useTemplateRef('userDropdownRef');
const handleClickOutside = (e: MouseEvent) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(e.target as Node)) {
    showUserDropdown.value = false;
  }
};
if (typeof document !== 'undefined') {
  document.addEventListener('click', handleClickOutside);
}

// ==================== 常量 ====================
const appName = __APP_NAME__;
const appVersion = __APP_VERSION__;
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- ========== 移动端遮罩层 ========== -->
    <Transition name="overlay-fade">
      <div v-show="mobileMenuOpen" class="fixed inset-0 z-40 bg-black/50 md:hidden" @click="closeMobileMenu" />
    </Transition>

    <!-- ========== 侧边栏 ========== -->
    <aside
      class="z-50 flex shrink-0 flex-col transition-all duration-300 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:shadow-2xl"
      :class="[isCollapse ? 'w-16' : 'w-55', mobileMenuOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full']"
      style="background-color: #28365c"
    >
      <!-- Logo -->
      <router-link
        to="/"
        class="flex h-15 shrink-0 items-center justify-center gap-2"
        style="background-color: #5768b7"
        @click="closeMobileMenu"
      >
        <img src="../assets/images/icon-s.png" width="30" alt="logo" />
        <span v-show="!isCollapse" class="overflow-hidden text-base whitespace-nowrap text-white"
          >{{ appName }} {{ appVersion }}</span
        >
      </router-link>

      <!-- 菜单区域 -->
      <div class="flex-1 overflow-x-hidden overflow-y-auto py-2">
        <div v-for="menu in menuData" :key="menu.index">
          <!-- 子菜单标题 -->
          <div
            class="flex h-12 cursor-pointer items-center px-4 text-white/80 transition-colors duration-200 select-none hover:bg-[#172853] hover:text-[#5268bc]"
            :class="{ 'bg-[#172853] text-[#5268bc]': openedSubMenu === menu.index || isMenuGroupActive(menu) }"
            @click="toggleSubMenu(menu.index)"
          >
            <!-- 图标 -->
            <svg
              v-if="menu.icon === 'dashboard'"
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            <svg
              v-else-if="menu.icon === 'monitor'"
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <svg
              v-else-if="menu.icon === 'user'"
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <svg
              v-else-if="menu.icon === 'box'"
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span v-show="!isCollapse" class="ml-3 flex-1 overflow-hidden text-sm whitespace-nowrap">{{
              menu.title
            }}</span>
            <!-- 展开箭头 -->
            <svg
              v-show="!isCollapse"
              class="h-4 w-4 shrink-0 transition-transform duration-200"
              :class="{ 'rotate-90': openedSubMenu === menu.index }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>

          <!-- 子菜单项 -->
          <Transition name="submenu-slide">
            <div v-show="openedSubMenu === menu.index && !isCollapse" class="overflow-hidden">
              <router-link
                v-for="child in menu.children"
                :key="child.index"
                :to="child.index"
                class="flex h-10 items-center pr-4 pl-14 text-sm text-white/70 transition-colors duration-200 hover:bg-[#172853] hover:text-[#5268bc]"
                :class="{ 'bg-[#172853] text-[#5268bc]': isActiveMenu(child.index) }"
                @click="closeMobileMenu"
              >
                {{ child.title }}
              </router-link>
            </div>
          </Transition>
        </div>
      </div>
    </aside>

    <!-- ========== 右侧主体 ========== -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- 头部 -->
      <header class="z-10 flex h-15 shrink-0 items-center justify-between bg-white px-4 shadow-md">
        <div class="flex items-center gap-3">
          <!-- 移动端汉堡菜单 -->
          <button
            class="flex h-9 w-9 items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg
              v-if="mobileMenuOpen"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <!-- 折叠按钮 -->
          <button
            class="hidden h-9 w-9 items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-100 md:flex"
            @click="isCollapse = !isCollapse"
          >
            <svg
              v-if="isCollapse"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <!-- 右侧菜单 -->
        <div class="flex items-center gap-4">
          <!-- 用户下拉 -->
          <div ref="userDropdownRef" class="relative">
            <button
              class="flex cursor-pointer items-center gap-2 transition-opacity outline-none hover:opacity-80"
              @click.stop="toggleUserDropdown"
            >
              <img
                :src="userStore.avatar || ''"
                class="h-9 w-9 rounded object-cover"
                style="image-rendering: pixelated"
                alt="avatar"
              />
              <span class="hidden text-sm text-gray-700 sm:inline">{{ userStore.username }}</span>
              <svg
                class="h-4 w-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': showUserDropdown }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <!-- 下拉菜单（Teleport 到 body 避免被表格遮挡） -->
            <Teleport to="body">
              <Transition name="dropdown-fade">
                <div
                  v-show="showUserDropdown"
                  :style="dropdownStyle"
                  class="z-[9999] w-36 rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
                >
                  <button
                    class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    @click="onUserMenuClick('/')"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    返回主页
                  </button>
                  <button
                    class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    @click="onUserMenuClick('/admin')"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    管理首页
                  </button>
                  <div class="my-1 border-t border-gray-100"></div>
                  <button
                    class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                    @click="onUserMenuClick('logout')"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    安全退出
                  </button>
                </div>
              </Transition>
            </Teleport>
          </div>
        </div>
      </header>

      <!-- 主体内容 -->
      <div class="flex-1 overflow-y-auto bg-gray-50">
        <main class="p-5">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<style>
/* 下拉菜单过渡动画 */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 移动端遮罩过渡 */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* 子菜单展开/收起动画 */
.submenu-slide-enter-active,
.submenu-slide-leave-active {
  transition:
    max-height 0.4s ease,
    opacity 0.4s ease;
}

.submenu-slide-enter-from,
.submenu-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.submenu-slide-enter-to,
.submenu-slide-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* 主内容区 overflow 修正 */
.el-main {
  overflow: visible;
}
</style>
