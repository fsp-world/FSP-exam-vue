import request from '@/utils/requers';
import type { UploadSchematicFormData } from '@/types';

export const getSchematics = () => request.get('/schematic/queryAll');
export const uploadSchematic = async (data: UploadSchematicFormData) => {
  const formData = new FormData()
  formData.append('fileName', data.fileName.trim());
  formData.append('originalAuthor', data.originalAuthor.trim());
  formData.append('desc',data.desc.trim());
  formData.append('type',data.type.trim());
  formData.append('tags',data.tags.trim());
  formData.append('isPublic', data.isPublic.trim());
  formData.append('gameVersion',data.gameVersion.trim());

  if(data.uploadFile){
    formData.append('uploadFile', data.uploadFile );
  }

  const response = await request.post('/schematic/upload', formData);
  return response
}
