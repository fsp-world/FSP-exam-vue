import type { FetchResponse, PaginateData } from ".";

export const schematicTypes = [
  { data: 0, label: '其他' },
  { data: 1, label: '红石' },
  { data: 2, label: '建筑' },
]
// 提取出数字类型（用于函数参数约束或接口定义）
export type SchematicType = typeof schematicTypes[number]['data']; // 0 | 1 | 2

export function getSchematicTypeItem(data: number) {
  const item = schematicTypes.find(item => item.data === data);
  return item
}

export interface GetSchematicParams {
  type: number;
  page: number; // 页码
  per_page: number; // 每页几项
}

export interface GetSchematicBySearchParams extends GetSchematicParams{
  text: string;
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
  type: number;
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
