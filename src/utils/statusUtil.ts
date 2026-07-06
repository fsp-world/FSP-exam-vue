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

export const reviewedStatus = (key: number): string => {
  switch (key) {
    case 0:
      return '待审核';
    case 1:
      return '已通过';
    case 2:
      return '已拒绝';
    case 3:
      return '已超时';
    default:
      return '未知';
  }
};

export const reviewedColor = (key: number): string => {
  if (key === 1) return 'text-green-600';
  if (key === 2) return 'text-red-500';
  return 'text-gray-400';
};

interface SeasonConfig {
  startDate: string;
  label: string;
}

const SEASONS: SeasonConfig[] = [
  { startDate: '2021-05-08', label: '一期成员' },
  { startDate: '2024-07-05', label: '二期成员' },
];

/**
 * 获取用户所属的期数
 * @param joinTime 用户的加入时间 (Date 对象)
 */
export const getUserJoinSeason = (joinTime: Date | string): string => {
  let validDate: Date;
  if (typeof joinTime === 'string') {
    validDate = new Date(joinTime);
  } else {
    validDate = joinTime;
  }

  // 校验日期是否有效
  if (!validDate || isNaN(validDate.getTime())) {
    throw new Error('Invalid joinTime provided');
  }
  // 提取本地日期的 YYYY-MM-DD 字符串，彻底规避时区转换问题
  const joinDateStr = validDate.toLocaleDateString('en-CA'); // 'en-CA' 会输出 YYYY-MM-DD 格式

  // 倒序遍历，找到第一个小于等于加入时间的赛季
  for (let i = SEASONS.length - 1; i >= 0; i--) {
    if (joinDateStr >= SEASONS[i].startDate) {
      return SEASONS[i].label;
    }
  }

  return '未知成员';
};
