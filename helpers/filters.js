// {{ $filter.method(param) }}

import dayjs, { months } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

export const dateFormat = (value, format='DD/MM/YYYY') => {
  return dayjs(value).format(format);
};

export const dateTimeago = (seconds) => {
  if (typeof seconds=='string') {
    seconds = dayjs().diff(seconds, 'second');
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (months >= 1) return `${months} mes(es)`;
  if (weeks >= 1) return `${weeks} semana(s)`;
  if (days >= 1) return `${days} dia(s)`;
  if (hours >= 1) return `${hours}hs ${minutes % 60} minutos`;
  if (minutes >= 1) return `${minutes} minuto(s)`;
  return `${Math.round(seconds)} segundos`;
};

export const filesizeHuman = (size) => {
  if (!size || isNaN(size)) return '0kB';
  let i = Math.floor( Math.log(+size) / Math.log(1024) );
  return ( +size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

export const numberFormat = (number, decimals=2, dsep=',', tsep='.') => {
  let [ n1, n2 ] = parseFloat(number).toFixed(decimals).split('.');
  n1 = n1.split('').reverse().join('').replace(/(\d{3})/g, `$1${tsep}`).split('').reverse().join('');
  return [n1, n2].join(dsep).replace(new RegExp(`^\\${tsep}`, 'g'), '');
};
