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

interface SeasonConfig {
  startDate: Date;
  label: string;
}

const SEASONS: SeasonConfig[] = [
  { startDate: new Date('2021-05-08'), label: '一期成员' },
  { startDate: new Date('2024-07-05'), label: '二期成员' },
];

// 去除日期的时间部分
const normalizeDate = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const getUserJoinSeason = (joinTime: Date | string | null | undefined): string => {
  if (!joinTime) {
    throw new Error('joinTime is required');
  }
  let joinTimestamp: number;

  try {
    if (typeof joinTime === 'string') {
      const parsedDate = new Date(joinTime);
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid date string: ${joinTime}`);
      }
      joinTimestamp = normalizeDate(parsedDate);
    } else {
      if (isNaN(joinTime.getTime())) {
        throw new Error('Invalid Date object provided');
      }
      joinTimestamp = normalizeDate(joinTime);
    }
  } catch (error) {
    throw new Error(`Failed to parse joinTime: ${error instanceof Error ? error.message : error}`);
  }

  for (const season of SEASONS) {
    const seasonStart = normalizeDate(season.startDate);
    if (joinTimestamp >= seasonStart) {
      return season.label;
    }
  }

  return '未知成员';
};
