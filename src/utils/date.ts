import moment from 'moment';

export const dateFormatYYYYMMDDHH = (date: string) => moment.utc(date).local().format('YYYY年MM月DD日 HH时');
export const dateFormatHHMMSS = (date: string) => moment.utc(date).local().format('HH时 hh分 ss秒');
export const dateFormatMMDDHHMM = (date: string) => moment.utc(date).local().format('MM月DD日 HH时mm分');
