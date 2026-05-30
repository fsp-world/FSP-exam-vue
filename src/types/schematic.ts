import type { FetchResponse, PaginateData } from ".";

export const schematicTypes = [
  { label: '其他', data: 'other', code: 0 },
  { label: '红石', data: 'redstone', code: 1 },
  { label: '建筑', data: 'architecture', code: 2 },
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

export interface SchematicBrief {
  id: number
  name: string;
  type: number | string;
  uploader: string;
  originalAuthor: string;
  uploadDate: string;
  updateDate: string;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
  gameVersion: string;
}

export interface SchematicDetail extends SchematicBrief{
  description: string;
  fileSizeKB: string;
  backupLink: string;
}

export type SchematicsResponse = FetchResponse<PaginateData<SchematicBrief>>
export type SchematicDetailResponse = FetchResponse<SchematicDetail>
