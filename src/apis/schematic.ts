import request from '@/utils/requers';
import type { GetSchematicParams, UploadSchematicFormData, GetSchematicBySearchParams } from '@/types/schematic';

const buildSchematicFormData = (data: UploadSchematicFormData): FormData => {
  const formData = new FormData();
  if (data.id){
    formData.append('id', data.id);
  }
  formData.append('name', data.name.trim());
  formData.append('originalAuthor', data.originalAuthor.trim());
  formData.append('desc', data.desc.trim());
  formData.append('type', data.type);
  formData.append('tags', data.tags.trim());
  formData.append('isPublic', data.isPublic.trim());
  formData.append('gameVersion', data.gameVersion.trim());
  formData.append('backupLink', data.backupLink.trim());

  if (data.uploadFile) {
    formData.append('uploadFile', data.uploadFile);
  }

  return formData;
};

export const getSchematicsByTypeAPI = (params: GetSchematicParams) => request.get('/schematic/query_by_type', {params: params});
export const getSchematicDetailAPI = (id: number) => request.get('/schematic/query_detail', { params: {id: id}})
export const getSchematicsBySearchAPI = (params: GetSchematicBySearchParams) => request.get('/schematic/search', {params: params});
export const downloadSchematicAPI = (id: number) => request.get('/schematic/download', { params: {id: id}, responseType: 'blob' });
export const deleteSchematicAPI = (id: number) => request.get('/schematic/delete', { params: {id: id} });
export const uploadSchematicAPI = async (data: UploadSchematicFormData) => {
  const formData = buildSchematicFormData(data);
  return await request.post('/schematic/upload', formData);
};
export const updateSchematicAPI = async (data: UploadSchematicFormData) => {
  const formData = buildSchematicFormData(data);
  return await request.post('/schematic/update', formData);
};
