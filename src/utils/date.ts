import moment from 'moment';

export const dateFormat = (date: string) => moment(date).format('YY年MM月DD日 HH时')