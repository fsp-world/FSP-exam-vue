export const schematicTypes = [
  { label: '红石', data: 'redstone' },
  { label: '建筑', data: 'architecture' },
  { label: '其他', data: 'other' }
]

export interface GetSchematicParams {
  type: string;
  page: number; // 页码
  per_page: number; // 每页几项
}

export interface UploadSchematicFormData {
  name: string;
  originalAuthor: string;
  desc: string;
  type: string;
  tags: string;
  isPublic: 'true' | 'false';
  gameVersion: string;
  uploadFileName: string;
  uploadFile: File | null;
  backupLink: string;
}

export interface Schematic{
  name: string;
  uploader: string;
  originalAuthor: string;
  uploadDate: string;
  EditDate: string;
  desc: string;
  size: string;
  type: string;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
  gameVersion: string;
}
