// 定义列映射项的类型
type ColumnMapItem = {
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  callback?: (value: any, row?: any) => any; // 可选的回调函数
};

export interface BaseTableProps {
  caption?: string;
  columnMap: Map<string, ColumnMapItem>;
  stripe?: boolean;
  bordered?: boolean;
}

export interface IPagination {
  page: number;
  size: number;
}

export interface IalertData {
  type: CardType;
  title: string;
  message: string;
  age: number;
  flag: boolean;
}

export type CardType = 'warn-card' | 'info-card';

export interface IResponse {
  id: number;
  isCompleted: boolean;
  isReviewed: number;
  username: string;
  survey: string;
  surveyId: number;
  score: number;
  playername: string;
  responseTime: string;
  createTime: string;
  reviewer_name: string;
}

export interface IQueryResponse {
  id: number;
  type: string;
  survey_name?: string;
  responseTime: string;
  state: 0 | 1 | 2;
  get_score: number;
  full_score: number;
}

export type RoleType = 'admin' | 'helper' | 'user';

export type StatusType = 0 | 1 | 2 | 3 | 4;

export interface UserUpdate {
  id: number;
  username: string;
  userQQ: string;
  role: RoleType;
  status: StatusType;
  addtime: string;
  password: string;
  passwordAgain: string;
}

export interface User {
  id: number;
  username: string;
  userQQ: string;
  role: RoleType;
  status: StatusType;
  addtime: string;
  isLogin: boolean;
  isAdmin: boolean;
  playPermission: boolean;
  avatarUUID: string;
  avatar: string;
  background: string;
}

export enum ConfigItemType {
  STR = 'str',
  INT = 'int',
  BOOL = 'bool',
  LIST = 'list',
}

export interface ConfigItem {
  key: string;
  value: string;
  type: ConfigItemType;
  desc: string;
}

export interface FetchResponse<T = any> {
  data: {
    code: number;
    desc: string;
    data: T;
  };
}

export interface PaginateData<T = any> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}
