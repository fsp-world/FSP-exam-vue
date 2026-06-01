<script setup lang="ts">
import { ref } from 'vue'
import type { SchematicDetailResponse, SchematicDetail } from '@/types/schematic';
import { schematicTypes } from '@/types/schematic';
import { downloadSchematicAPI, getSchematicDetailAPI } from '@/apis/schematic';
import { openAlert } from '@/utils/TsAlert';
import { dateFormatYYYYMMDDHH } from '@/utils/date';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

import MCButton from '@/components/MCButton.vue';
import MCNameTag from '@/components/MCNameTag.vue';

const store = useUserStore();
const { username } = storeToRefs(store);

interface Props {
  isModalVisible: boolean
  sid: number
}

interface Emits {
  (e: 'update:isModalVisible', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  isModalVisible: false,
})

const emit = defineEmits<Emits>()

const GetSchematicDetailDefault = (): SchematicDetail => ({
  id: 0,
  name: '',
  type: '',
  uploader: '',
  originalAuthor: '',
  uploadDate: '',
  updateDate: '',
  tags: [],
  isPublic: false,
  downloadCount: 0,
  gameVersion: '',
  description: '',
  fileSizeKB: '',
  backupLink: '',
})

type SchematicCode = typeof schematicTypes[number]['code'];
const schematicTypeMap = Object.fromEntries(
  schematicTypes.map(item => [item.code, item.label])
) as Record<SchematicCode, string>;

const schematicDetail = ref<SchematicDetail>(GetSchematicDetailDefault())

const querySchematicDetail = (id: number) => {
  getSchematicDetailAPI(id).then((res: SchematicDetailResponse) => {
    if (res.data.code === 0) {
      schematicDetail.value = res.data.data
    } else {
      openAlert(res.data.desc, 'warn-card');
    }
  }).catch((error) => {
    console.error('获取投影详情失败:', error);
  });
}

querySchematicDetail(props.sid)

const download = () => {
  openAlert('开始下载...')
  downloadSchematicAPI(props.sid).then((res) => {

    if (res.headers['content-type']?.includes('application/json')) {
      const text = res.data.text();
      const errorData = JSON.parse(text);
      openAlert(errorData.desc || '下载失败', 'warn-card');
      return;
    }

    let fileName = `${schematicDetail.value.name}.litematic`;
    const disposition = res.headers['content-disposition'];
    if (disposition) {
      const utf8Match = disposition.match(/filename\*=(?:UTF-8''|utf-8'')(.+)/i);
      const fallbackMatch = disposition.match(/filename="?([^";]+)"?/);

      if (utf8Match) {
        fileName = decodeURIComponent(utf8Match[1]);
      } else if (fallbackMatch) {
        fileName = fallbackMatch[1];
      }
    }

    const blob = new Blob([res.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);

    openAlert('下载成功！');
  }).catch((error) => {
    console.error('下载失败:', error);
    openAlert('下载失败，请稍后再试', 'warn-card');
  });

}

</script>
<template>
  <div class="info">
    <div class="title">投影信息</div>
    <table class="table y-scroll">
      <tbody>
        <tr>
          <td class="label">
            <span class="no-in-mobil">投影类型</span>
            <span class="mobil">{{ schematicTypeMap[schematicDetail.type as number] ?? '未知' }}类型</span>
          </td>
          <td class="value">
            <span class="no-in-mobil">{{ schematicTypeMap[schematicDetail.type as number] ?? '未知类型' }} | 兼容版本&nbsp;{{
              schematicDetail.gameVersion }}</span>
            <span class="mobil">{{ schematicDetail.gameVersion }}</span>
          </td>
        </tr>
        <tr>
          <td class="label">上传用户</td>
          <td class="value">
            {{ schematicDetail.uploader }}
          </td>
        </tr>
        <tr>
          <td class="label">原始作者</td>
          <td class="value">{{ schematicDetail.originalAuthor }}</td>
        </tr>
        <tr>
          <td class="label">投影名称</td>
          <td class="value">
            {{ schematicDetail.name }}
          </td>
        </tr>
        <tr>
          <td class="label">投影标签</td>
          <td class="value">
            <div class="tags">
              <MCNameTag v-show="tag !== ''" :key="index" v-for="(tag, index) in schematicDetail.tags">{{ tag }}
              </MCNameTag>
            </div>

          </td>
        </tr>
        <tr>
          <td class="label">更新日期</td>
          <td class="value">
            {{ dateFormatYYYYMMDDHH(schematicDetail.updateDate) }}
          </td>
        </tr>
        <tr>
          <td class="label">投影权限</td>
          <td class="value">
            <img v-show="!schematicDetail.isPublic" class="lock" src="/src/assets/images/rainbow_pixel_gui/locked.png">
            {{ schematicDetail.isPublic ? '公开' : '私密' }}
          </td>
        </tr>
        <tr v-show="schematicDetail.backupLink">
          <td class="label">备用下载</td>
          <td class="value">
            <a :href="schematicDetail.backupLink" target="_blank" rel="noopener noreferrer">
              {{ schematicDetail.backupLink ? schematicDetail.backupLink.slice(0, 20) + "..." : "" }}
            </a>
          </td>
        </tr>
        <tr>
          <td class="label">投影描述</td>
          <td class="value">
            <details>
              <summary>{{ schematicDetail.description ? schematicDetail.description.slice(0, 15) + "..." : "" }}
              </summary>
              {{ schematicDetail.description }}
            </details>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <MCButton :disabled="schematicDetail.uploader != username && !schematicDetail.isPublic" :length="'medium'"
        @click="download">下载<span>({{
          schematicDetail.fileSizeKB }} KB)</span></MCButton>
      <MCButton :length="'medium'" @click="emit('update:isModalVisible', false)">关闭</MCButton>
    </div>
  </div>
</template>
<style scoped>
.info {
  padding: 55px 60px;
  box-sizing: border-box;
  width: 100%;
  max-width: 530px;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-weight: bold;
  text-align: center;
  line-height: 50px;
  user-select: none;
}

.table {
  display: block;
  overflow: auto;

  td {
    line-height: 43px;
    min-width: 120px;
    max-height: 43px;
    overflow-y: auto;
  }

  .label {
    color: #777;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 10px;
}

.lock {
  display: inline;
  width: 20px;
  position: relative;
  bottom: -8px;
}

.no-in-mobil {
  display: inline;
}

.mobil {
  display: none;
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;

  span {
    display: inline;
  }
}

@media screen and (max-width: 500px) {
  .info {
    width: 100vw;
    padding: 50px 40px;
  }

  .no-in-mobil {
    display: none;
  }

  .mobil {
    display: inline;
  }

  .buttons {
    span {
      display: none;
    }
  }
}
</style>
