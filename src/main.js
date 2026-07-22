import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import MCRouterLink from '@/components/MCRouterLink.vue';

// 浏览器兼容性检测 — 不通过则跳转 error 页，阻止应用挂载
import { checkBrowserBeforeMount } from '@/utils/browserCheck';
checkBrowserBeforeMount();

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

app.component('MCRouterLink', MCRouterLink);

app.mount('#app');
