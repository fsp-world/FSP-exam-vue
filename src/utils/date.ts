import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(duration);

export const dateFormatYYYYMMDDHHmm = (date: string) =>
  dayjs.utc(date).local().format('YYYY年MM月DD日 HH:mm');
export const dateFormatYYYYMMDDHH = (date: string) =>
  dayjs.utc(date).local().format('YYYY年MM月DD日 HH时');
export const dateFormatYYYYMMDD = (date: string) =>
  dayjs.utc(date).local().format('YYYY年MM月DD日');
export const dateFormatHHMMSS = (date: string) =>
  dayjs.utc(date).local().format('HH时 mm分 ss秒');
export const dateFormatMMDDHHmm = (date: string) =>
  dayjs.utc(date).local().format('MM月DD日 HH时mm分');
export const dateFormatHHmm = (date: string) =>
  dayjs.utc(date).local().format('HH时 mm分');
export const dateFormatDDHHmm = (date: string) =>
  dayjs.utc(date).local().format('DD日HH时mm分');

/**
 * 根据时间跨度自动选择合适的时间格式
 * @param date - ISO 日期字符串
 * @param spanMs - 时间范围（毫秒）
 * @returns 格式化后的时间字符串
 */
export const dateFormatBySpan = (date: string, spanMs: number) => {
  const d = dayjs.utc(date).local();
  const spanHours = spanMs / (1000 * 60 * 60);
  if (spanHours <= 1) {
    // 最近1小时
    return d.format('HH:mm');
  } else if (spanHours <= 24) {
    // 最近24小时
    return d.format('DD日 HH:mm');
  } else if (spanHours <= 24 * 7) {
    // 最近7天
    return d.format('MM月DD日 HH时');
  } else {
    // 更久
    return d.format('YYYY年MM月DD日');
  }
};

/**
 * 格式化剩余时间
 * @param remainingTimeMs - 剩余时间（单位：毫秒）
 * @returns '00时 00分 00秒' 形式的剩余时间
 */
export const formatRemainingTimeToHHmmss = (remainingTimeMs: number) => {
  const dur = dayjs.duration(remainingTimeMs); // 把毫秒数转成一个时长对象
  const hours = String(Math.floor(dur.asHours())).padStart(2, '0');
  const minutes = String(dur.minutes()).padStart(2, '0');
  const seconds = String(dur.seconds()).padStart(2, '0');
  return `${hours}时 ${minutes}分 ${seconds}秒`;
};
