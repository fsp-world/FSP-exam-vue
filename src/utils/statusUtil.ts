export const computStatus = (status: number): string => {
  switch (status) {
    case 0:
      return '未激活';
    case 1:
      return '正常';
    case 2:
      return '临时封禁';
    case 3:
      return '封禁';
    case 4:
      return '删除';
    default:
      return '未知';
  }
};

