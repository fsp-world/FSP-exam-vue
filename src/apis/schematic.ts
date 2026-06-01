import request from '@/utils/requers';
import type { GetSchematicParams, UploadSchematicFormData, GetSchematicBySearchParams } from '@/types/schematic';

export const getSchematicsByTypeAPI = (params: GetSchematicParams) => request.get('/schematic/query_by_type', {params: params});
export const getSchematicDetailAPI = (id: number) => request.get('/schematic/query_detail', { params: {id: id}})
export const uploadSchematic = async (data: UploadSchematicFormData) => {
  const formData = new FormData()
  formData.append('fileName', data.name.trim());
  formData.append('originalAuthor', data.originalAuthor.trim());
  formData.append('desc',data.desc.trim());
  formData.append('type',data.type.trim());
  formData.append('tags',data.tags.trim());
  formData.append('isPublic', data.isPublic.trim());
  formData.append('gameVersion',data.gameVersion.trim());
  formData.append('backupLink', data.backupLink.trim());

  if(data.uploadFile){
    formData.append('uploadFile', data.uploadFile );
  }

  const response = await request.post('/schematic/upload', formData);
  return response
}

export const getSchematicsBySearchAPI = (params: GetSchematicBySearchParams) => request.get('/schematic/search', {params: params});
