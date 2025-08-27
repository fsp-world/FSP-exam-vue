import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import MCRouterLink from '@/components/MCRouterLink.vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

app.component('MCRouterLink', MCRouterLink);

app.mount('#app');

app.use(ElementPlus, {
  locale: zhCn,
  size: 'small',
  zIndex: 3000,
});
