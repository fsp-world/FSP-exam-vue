import moment from 'moment';

export const dateFormatYYYYMMDDHHmm = (date: string) =>
  moment.utc(date).local().format('YYYY年MM月DD日 HH:mm');
export const dateFormatYYYYMMDDHH = (date: string) =>
  moment.utc(date).local().format('YYYY年MM月DD日 HH时');
export const dateFormatYYYYMMDD = (date: string) =>
  moment.utc(date).local().format('YYYY年MM月DD日');
export const dateFormatHHMMSS = (date: string) =>
  moment.utc(date).local().format('HH时 mm分 ss秒');
export const dateFormatMMDDHHmm = (date: string) =>
  moment.utc(date).local().format('MM月DD日 HH时mm分');
export const dateFormatHHmm = (date: string) =>
  moment.utc(date).local().format('HH时 mm分');
export const dateFormatDDHHmm = (date: string) =>
  moment.utc(date).local().format('DD日HH时mm分');

/**
 * 格式化剩余时间
 * @param remainingTimeMs - 剩余时间（单位：毫秒）
 * @returns '00时 00分 00秒' 形式的剩余时间
 */
export const formatRemainingTimeToHHmmss = (remainingTimeMs: number) => {
  const dur = moment.duration(remainingTimeMs); // 把毫秒数转成一个时长对象
  const hours = String(Math.floor(dur.asHours())).padStart(2, '0');
  const minutes = String(dur.minutes()).padStart(2, '0');
  const seconds = String(dur.seconds()).padStart(2, '0');
  return `${hours}时 ${minutes}分 ${seconds}秒`;
};
