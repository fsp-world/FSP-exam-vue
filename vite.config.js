import { createRequire } from 'node:module';
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';
import babel from '@babel/core';
import presetEnv from '@babel/preset-env';
import pkg from './package.json';

const require = createRequire(import.meta.url);
// 用精确的 core-js 版本，避免 useBuiltIns 用旧特性表漏掉 .at()/hasOwn/findLast 等新 API
const corejsVersion = require('core-js/package.json').version;

// ES2020 基线浏览器（与 esbuild 的 es2020 目标一致）
const ES2020_TARGETS = { chrome: '80', edge: '80', firefox: '80', safari: '14.1', opera: '67' };

/**
 * 构建期用 Babel preset-env + useBuiltIns:'usage' 按需注入 core-js polyfill。
 * 只作用于 build（dev 保持原生最新特性 + 快 HMR），只处理源码，不碰 node_modules。
 */
function babelCorejsPolyfills() {
  let isBuild = false;
  return {
    name: 'vite:es2020-corejs-polyfills',
    enforce: 'post',
    configResolved(config) {
      isBuild = config.command === 'build';
    },
    async transform(code, id) {
      if (!isBuild) return null;
      if (id.includes('node_modules')) return null;
      const clean = id.split('?')[0];
      const isVueScript = clean.endsWith('.vue') && id.includes('type=script');
      if (!isVueScript && !/\.(mjs|js|jsx|ts|tsx)$/.test(clean)) return null;
      try {
        const result = await babel.transformAsync(code, {
          filename: id,
          babelrc: false,
          configFile: false,
          sourceMaps: true,
          presets: [
            [
              presetEnv,
              {
                targets: ES2020_TARGETS,
                useBuiltIns: 'usage',
                corejs: corejsVersion,
                modules: false,
              },
            ],
          ],
        });
        if (!result || !result.code || result.code === code) return null;
        return { code: result.code, map: result.map ?? null };
      } catch {
        // 解析失败（如仍含 TS/JSX）就跳过，交给 Vite 默认处理
        return null;
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss(), babelCorejsPolyfills()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
  },
  define: {
    __APP_NAME__: JSON.stringify(pkg.name),
    __APP_VERSION__: JSON.stringify('v' + pkg.version),
  },
});
