import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useStorage } from '@vueuse/core';

import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

export default function(params = {}) {
  const { $dayjs, $axios } = useNuxtApp();
  $dayjs.extend(duration);
  $dayjs.extend(relativeTime);

  params = {
    storageKey: 'clockify',
    dateStart: $dayjs().startOf('month').format('YYYY-MM-DDTHH:mm:ss.000z'),
    dateFinal: $dayjs().endOf('month').format('YYYY-MM-DDTHH:mm:ss.000z'),
    currencyFrom: 'USD',
    currencyTo: 'BRL',
    timeEntryParse: entry => entry,
    ...params
  };

  const dateStart = ref(params.dateStart || null);
  // const _dateStart = () => $dayjs(dateStart.value);

  const dateFinal = ref(params.dateFinal || null);
  // const _dateFinal = () => $dayjs(dateFinal.value);

  const storage = ref(useStorage(params.storageKey, {
    token: '',
    amountPerHour: 13,
    amountCurrency: "BRL",
    amountGoal: 1000,
    currencyFrom: params.currencyFrom,
    currencyTo: params.currencyTo,
    securityMode: false,
  }));

  const request = async (params) => {
    return $axios.request({
      ...params,
      url: [ 'https://api.clockify.me/api/v1', params.url.replace(/^\/|\/$/g, '') ].join('/'),
      headers: { 'X-Api-Key': storage.value.token },
    });
  };

  const currency = ref({
    loading: false,
    currencyFrom: params.currencyFrom,
    currencyTo: params.currencyTo,
    rates: {},
  });

  const currencyLoad = async () => {
    currency.value.loading = true;
    const { data } = await $axios.get(`https://api.exchangerate.host/latest?base=${storage.value.currencyFrom}`);
    currency.value.rates = data.rates;
    currency.value.loading = false;
  };

  const currencyFormat = (number, decimals=2, dsep=',', tsep='.') => {
    let [ n1, n2 ] = parseFloat(number).toFixed(decimals).split('.');
    n1 = n1.split('').reverse().join('').replace(/(\d{3})/g, `$1${tsep}`).split('').reverse().join('');
    return [n1, n2].join(dsep).replace(new RegExp(`^\\${tsep}`, 'g'), '');
  };

  const currencyConvert = (value, format=true) => {
    const code = storage.value.currencyTo;
    value = value * currency.value.rates[ code ] || 1;
    return format ? currencyFormat(value) : value;
  };

  const user = ref({
    loading: false,
    data: false,
  });

  const userLoad = async () => {
    if (!storage.value.token) return;
    user.value.loading = true;
    const { data } = await request({ url: '/user' });
    user.value.data = data;
    user.value.loading = false;
  };
  
  const workspace = ref({
    loading: false,
    selected: false,
    data: [],
  });

  const workspaceLoad = async () => {
    if (!storage.value.token) return;
    workspace.value.loading = true;
    const { data } = await request({ url: '/workspaces' });
    workspace.value.data = data;
    if (data.length==1) {
      workspace.value.selected = data[0];
    }
    workspace.value.loading = false;
  };

  const timeEntry = ref({
    loading: false,
    workedMinutes: 0,
    working: false,
    data: [],
  });

  const timeEntryLoad = async () => {
    if (timeEntry.value.loading) {
      clearTimeout(timeEntry.value.loading);
    }

    timeEntry.value.loading = setTimeout(async () => {
      if (!user.value) return;
      if (!workspace.value.selected) return;
      
      timeEntry.value.loading = true;

      const { data } = await request({
        url: `/workspaces/${workspace.value.selected.id}/user/${user.value.data.id}/time-entries`,
        params: { start: dateStart.value, end: dateFinal.value },
      });

      timeEntry.value.data = data.map(timeEntryParse);
      timeEntry.value.loading = false;
    }, 1000);
  };

  const timeEntryParse = (entry) => {
    entry.workedMinutes = (() => {
      if (!entry.timeInterval.end) {
        return Math.abs($dayjs(entry.timeInterval.start).diff($dayjs(), 'minute'));
      }

      return Math.abs($dayjs(entry.timeInterval.start).diff(entry.timeInterval.end, 'minute'));
    })();

    entry = params.timeEntryParse(entry);
    return entry;
  };

  let _timeEntryInterval;
  const timeEntryInterval = async () => {
    if (_timeEntryInterval) {
      clearTimeout(_timeEntryInterval);
    }

    _timeEntryInterval = setInterval(() => {
      timeEntry.value.data = timeEntry.value.data.map(timeEntryParse);
      let working = timeEntry.value.data.filter(entry => !entry.timeInterval.end);
      timeEntry.value.working = working[0] || false;
      timeEntry.value.workedMinutes = timeEntry.value.data.reduce((total, entry) => {
        return total + entry.workedMinutes;
      }, 0);
    }, 1000);
  };

  const rangeDays = () => {
    let diff = Math.abs($dayjs(dateStart.value).diff(dateFinal.value, 'days'));
    return Array.from(Array(diff+1).keys()).map(days => {
      return $dayjs(dateStart.value).add(days, 'days');
    });
  };

  const timeHumanize = (minutes) => {
    let format = [
      {
        value: Math.floor(minutes / 60 / 24 / 30),
        signal: 'mês',
      },
      {
        value: Math.floor(minutes / 60 / 24),
        signal: 'dia(s)',
      },
      {
        value: Math.floor(minutes / 60),
        signal: 'hs',
      },
      {
        value: minutes % 60,
        signal: 'm',
      },
    ]
    .filter(item => item.value > 0)
    .map(item => item.value+item.signal)
    .join(', ');

    return format;

    // console.clear();
    // console.log(JSON.stringify(format, ' ', 2));
    // return $dayjs.duration(minutes, "minutes").humanize();
  };

  const ready = computed(() => {
    return user.value.data
      && workspace.value.data.length>=1
      && timeEntry.value.data.length>=1;
  });

  const dates = computed(() => {
    return rangeDays().map((dd) => {

      const entries = timeEntry.value.data.filter((entry) => {
        return $dayjs(entry.timeInterval.start).format('YYYY-MM-DD') == dd.format('YYYY-MM-DD');
      });

      let is = {};
      is.today = $dayjs().format('YYYY-MM-DD') == dd.format('YYYY-MM-DD');
      is.workingDay = ![0, 6].includes(dd.day());

      return {
        date: dd,
        year: dd.format('YYYY'),
        month: dd.format('MM'),
        day: dd.format('DD'),
        is,
        entries,
      };
    });
  });

  const result = computed(() => {
    const workingDays = rangeDays().filter(date => {
      return ![0, 6].includes(date.day());
    });

    const dataItem = (params) => {
      params = {
        description: '',
        value: 0,
        formatted: (me) => me.value,
        ...params
      };

      if (typeof params.value=='function') params.value = params.value(params);
      if (typeof params.description=='function') params.description = params.description(params);
      if (typeof params.formatted=='function') params.formatted = params.formatted(params);

      return params;
    };

    let r = {};

    r.rangeWorkExpected = dataItem({
      description: `Tempo total esperado para trabalhar (${workingDays.length} dias úteis)`,
      value: 60 * 8 * workingDays.length,
      formatted: (me) => `${(me.value/60).toFixed(0)} horas`,
    });

    r.rangeWorkWorked = dataItem({
      description: 'Tempo total trabalhado',
      value: timeEntry.value.workedMinutes,
      formatted: (me) => `${(me.value/60).toFixed(0)} horas`,
    });

    r.rangeWorkWorkedPercent = dataItem({
      description: (me) => `${me.value.toFixed(0)}% do mês trabalhado`,
      value: r.rangeWorkWorked.value / r.rangeWorkExpected.value * 100,
      formatted: me => me.value.toFixed(0)+'%',
    });

    r.amountTotal = dataItem({
      description: `Total para receber`,
      value: (timeEntry.value.workedMinutes / 60) * storage.value.amountPerHour,
      formatted: (me) => `${currencyFormat(me.value)} (${storage.value.currencyFrom}) / ${currencyConvert(me.value)} (${storage.value.currencyTo})`,
    });

    r.rangeWorkDayAverage = dataItem({
      description: (me) => `Quantidade de horas diárias para alcançar a meta`,
      value: (me) => {
        const daysToEnd = Math.abs($dayjs().diff(dateFinal.value, 'days'));
        const amountMissing = storage.value.amountGoal - r.amountTotal.value;
        const hoursToWork = amountMissing / storage.value.amountPerHour;
        return Math.ceil(hoursToWork / daysToEnd);
      },
      formatted: me => `${me.value} horas / dia`,
    });

    r.amountGoal = dataItem({
      description: `Meta mensal`,
      value: storage.value.amountGoal,
      formatted: (me) => `${currencyFormat(me.value)} (${storage.value.currencyFrom}) / ${currencyConvert(me.value)} (${storage.value.currencyTo})`,
    });
    
    r.amountGoalPercent = dataItem({
      description: (me) => `${me.value.toFixed(0)}% do valor da meta alcançada`,
      value: r.amountTotal.value / storage.value.amountGoal * 100,
      formatted: me => me.value.toFixed(0)+'%',
    });

    return r;
  });

  watch([ dateStart, dateFinal, storage ], async ([ dateStartNew, dateFinalNew ]) => {
    await currencyLoad();
    await timeEntryLoad();
  });

  onMounted(async () => {
    await currencyLoad();
    await userLoad();
    await workspaceLoad();
    await timeEntryLoad();
    await timeEntryInterval();
  });

  onUnmounted(() => {
    if (_timeEntryInterval) {
      clearInterval(_timeEntryInterval);
    }
  });

  return {
    ready,
    dateStart,
    dateFinal,
    storage,
    currency,
    currencyLoad,
    currencyFormat,
    currencyConvert,
    user,
    userLoad,
    workspace,
    workspaceLoad,
    timeEntry,
    timeEntryLoad,
    timeHumanize,
    dates,
    result,
  };
};