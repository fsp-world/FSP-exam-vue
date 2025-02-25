const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
export const checkPassword = (password: string): boolean => {
  // 密码校验
  return passwordRegex.test(password);
};
