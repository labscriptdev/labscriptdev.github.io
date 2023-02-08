import { ref, computed } from 'vue';

import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

export default function(params = {}) {

  params = {
    date: dayjs().format(),
    rangeStart: null,
    rangeFinal: null,
    ...params
  };

  const date = ref(params.date);
  const rangeStart = ref(params.rangeStart || null);
  const rangeFinal = ref(params.rangeFinal || null);

  const _date = () => dayjs(date.value);
  const _rangeStart = () => rangeStart.value ? dayjs(rangeStart.value) : null;
  const _rangeFinal = () => rangeFinal.value ? dayjs(rangeFinal.value) : null;

  const dateIs = (currDate) => {
    return {
      today: currDate.format('YYYY-MM-DD') == _date().format('YYYY-MM-DD'),
      month: currDate.format('YYYY-MM') == _date().format('YYYY-MM'),
      year: currDate.format('YYYY') == _date().format('YYYY'),
    };
  };

  const dates = computed(() => {
    const start = _rangeStart() || _date().startOf('month');
    const final = _rangeFinal() || _date().endOf('month');
    
    let diff = start.diff(final, 'day');
    diff = Math.max(diff, -diff);

    let items = [];

    for(let i=0; i<=diff; i++) {
      const currDate = start.add(i, 'days');
      items.push({ date: currDate, is: dateIs(currDate) });
    }

    return items;
  });

  return { date, rangeStart, rangeFinal, dates };
};