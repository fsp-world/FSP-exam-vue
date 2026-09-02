import { openAlert } from '@/utils/TsAlert';

/**
 * 校验配置项的值不能为空（纯空白视为空）。
 * 系统设置与高级设置共用。
 * @param value 配置项的值
 * @returns 合法返回 true；为空时弹窗提醒并返回 false
 */
export const validateConfigValue = (value: unknown): boolean => {
  if (String(value ?? '').trim() === '') {
    openAlert('配置项的值不能为空');
    return false;
  }
  return true;
};
