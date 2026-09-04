const passwordComplexityRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[\s\S]{8,16}$/;

/**
 * 校验密码复杂性：
 * - 至少包含一个字母（A-Z 或 a-z）
 * - 至少包含一个数字
 * - 长度为 8 至 16 个字符
 *
 * 除上述条件外，不限制其他字符类型。
 */
export const isPasswordComplexityValid = (password: string): boolean => {
  return passwordComplexityRegex.test(password);
};
