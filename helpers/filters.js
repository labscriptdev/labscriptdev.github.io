// {{ $filter.method(param) }}

const numberFormat = (number, decimals=2, dsep=',', tsep='.') => {
  let [ n1, n2 ] = parseFloat(number).toFixed(decimals).split('.');
  n1 = n1.split('').reverse().join('').replace(/(\d{3})/g, `$1${tsep}`).split('').reverse().join('');
  return [n1, n2].join(dsep);
};

const filesizeHuman = (size) => {
  if (!size || isNaN(size)) return '0kB';
  let i = Math.floor( Math.log(+size) / Math.log(1024) );
  return ( +size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

export {
  numberFormat,
  filesizeHuman,
};