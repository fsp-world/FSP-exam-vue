<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import MCButton from '@/components/MCButton.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';
import MCDialog from '@/components/MCDialog.vue';
import BackgroundSettings from '@/components/BackgroundSettings.vue';

const userStore = useUserStore();
const { username, userQQ } = storeToRefs(userStore);

const displayBgPanel = ref(false);
const newUsername = ref('');
</script>

<template>
  <div class="space">
    <MCDialog :style="'card'" v-model:is-modal-visible="displayBgPanel">
      <BackgroundSettings v-model:is-modal-visible="displayBgPanel" />
    </MCDialog>
    <div class="translucent-bg"></div>
    <div class="translucent-content">
      <div class="title">
        <p>用户设置</p>
      </div>
      <div class="main">
        <Transition name="stagger" appear>
          <div class="settings-card" :style="{ transitionDelay: '0s' }">
            <p class="card-title">资料修改</p>
            <div class="field-group">
              <label class="field-label">当前用户名</label>
              <p class="current-value">{{ username }}</p>
            </div>
            <div class="field-group">
              <label class="field-label">绑定QQ</label>
              <p class="current-value">{{ userQQ || '未绑定' }}</p>
            </div>
            <div class="field-group">
              <label class="field-label">新用户名</label>
              <input v-model="newUsername" class="field-input" type="text" placeholder="请输入新用户名（最多16字）"
                maxlength="16" />
            </div>
            <MCButton class="save-btn" :disabled="!newUsername.trim()">保存</MCButton>
          </div>
        </Transition>
        <Transition name="stagger" appear>
          <div class="settings-card" :style="{ transitionDelay: '0.1s' }">
            <p class="card-title">个性化</p>
            <div class="settings-item" @click="displayBgPanel = true">
              <span class="settings-item-icon">🖼️</span>
              <div class="settings-item-content">
                <span class="settings-item-label">自定义背景</span>
                <span class="settings-item-desc">更换个人中心与首页的背景图片</span>
              </div>
              <span class="settings-item-arrow">›</span>
            </div>
          </div>
        </Transition>
      </div>
      <div class="end">
        <MCRouterLink to="/space" class="button">返回</MCRouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 16px;
}

.settings-card {
  width: calc(100% - 40px);
  max-width: 440px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.3);
}

.card-title {
  font-size: var(--title-font-size-small);
  color: #fff;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 12px;
  user-select: none;
}

.field-group {
  margin-bottom: 12px;
}

.field-label {
  display: block;
  font-size: var(--text-font-size-small);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
  user-select: none;
}

.current-value {
  font-size: var(--text-font-size-medium);
  color: #fff;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.field-input {
  display: block;
  width: 100%;
  font-size: var(--text-font-size-medium);
  color: #fff;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  transition: border-color 0.2s;
}

.field-input:focus {
  border-color: rgba(79, 192, 141, 0.6);
}

.field-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.save-btn {
  width: 100%;
  height: 40px;
  font-size: var(--button-font-size-medium) !important;
}

.settings-card .settings-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.settings-card .settings-item:hover {
  background: rgba(0, 0, 0, 0.3);
}

.settings-item-icon {
  font-size: 24px;
  line-height: 1;
}

.settings-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.settings-item-label {
  font-size: var(--text-font-size-medium);
  color: #fff;
}

.settings-item-desc {
  font-size: var(--text-font-size-small);
  opacity: 0.6;
  color: #fff;
}

.settings-item-arrow {
  font-size: 24px;
  opacity: 0.4;
  color: #fff;
}

.stagger-enter-active {
  transition: all 0.5s ease;
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
