// {{ $filter.method(param) }}

import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

const dateFormat = (value, format='DD/MM/YYYY') => {
  return dayjs(value).format(format);
};

const filesizeHuman = (size) => {
  if (!size || isNaN(size)) return '0kB';
  let i = Math.floor( Math.log(+size) / Math.log(1024) );
  return ( +size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const numberFormat = (number, decimals=2, dsep=',', tsep='.') => {
  let [ n1, n2 ] = parseFloat(number).toFixed(decimals).split('.');
  n1 = n1.split('').reverse().join('').replace(/(\d{3})/g, `$1${tsep}`).split('').reverse().join('');
  return [n1, n2].join(dsep).replace(new RegExp(`^\\${tsep}`, 'g'), '');
};

export {
  dateFormat,
  filesizeHuman,
  numberFormat,
};