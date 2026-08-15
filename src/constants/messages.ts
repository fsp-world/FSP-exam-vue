export const LOGIN_MESSAGES = {
  CHECKING: '登录中',
  SUCCESS: '登录成功! 即将跳转...',
  FAILED: '登录错误!',
  INVALID_PASSWORD:
    '密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度为8-16个字符',
} as const;

export const REGISTER_MESSAGES = {
  SUCCESS: '注册成功! 即将跳转...',
  FAILED: '出现错误!',
  PASSWORD_MISMATCH: '两次输入的密码不一致',
} as const;

export const FIND_PASSWORD_MESSAGES = {
  EMPTY_FIELDS: '请输入用户名和QQ',
} as const;

export const LOGOUT_MESSAGES = {
  CONFIRM: '您确定要退出当前登录吗？',
} as const;
