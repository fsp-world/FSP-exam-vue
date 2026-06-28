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
