import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useStorage } from '@vueuse/core';

import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

export default function(options = {}) {
  const { $dayjs, $axios } = useNuxtApp();
  $dayjs.extend(duration);
  $dayjs.extend(relativeTime);

  options = {
    storageKey: 'clockify',
    params: {},
    timeEntryParse: (entry) => entry,
    ...options
  };

  options.params = {
    dateStart:  $dayjs().startOf('month').format('YYYY-MM-DDTHH:mm:ss.000z'),
    dateFinal: $dayjs().endOf('month').format('YYYY-MM-DDTHH:mm:ss.000z'),
    dateToday: $dayjs.utc().format('YYYY-MM-DDTHH:mm:ss.000z'),
    workspaceId: false,
    ...options.params
  };

  const storage = useStorage(options.storageKey, {
    token: '',
    amountPerHour: 13,
    amountCurrency: "BRL",
    amountGoal: 1000,
    currencyFrom: options.currencyFrom,
    currencyTo: options.currencyTo,
    securityMode: false,
  });

  const clockifyRequest = async (params) => {
    return $axios.request({
      ...params,
      url: [ 'https://api.clockify.me/api/v1', params.url.replace(/^\/|\/$/g, '') ].join('/'),
      headers: { 'X-Api-Key': storage.value.token },
    });
  };

  const r = ref({
    ready: false,
    refreshCounter: 0,

    params: options.params,

    user: {
      loading: false,
      data: false,
      error: false,
      async load() {
        this.loading = true;

        try {
          const { data } = await clockifyRequest({ url: '/user' });
          this.data = {
            id: data.id,
            name: data.name,
            email: data.email,
            profilePicture: data.profilePicture,
            activeWorkspace: data.activeWorkspace,
            defaultWorkspace: data.defaultWorkspace,
          };
          
          if (!r.value.params.workspaceId) {
            r.value.params.workspaceId = data.activeWorkspace;
          }
        }
        catch(err) {
          this.error = err.response;
        }

        this.loading = false;
      },
    },

    workspace: {
      loading: false,
      data: [],
      error: false,
      async load() {
        this.loading = true;

        try {
          const { data } = await clockifyRequest({ url: '/workspaces' });
          this.data = data;
        }
        catch(err) {
          this.error = err.response;
        }

        this.loading = false;
      },
    },
    
    timeEntry: {
      loading: false,
      workedMinutes: 0,
      data: [],
      error: false,
      async load() {
        if (this.loading) clearTimeout(this.loading);
        this.loading = setTimeout(async () => {
          this.workedMinutes = 0;

          try {
            const { data } = await clockifyRequest({
              url: `/workspaces/${r.value.params.workspaceId}/user/${r.value.user.data.id}/time-entries`,
              params: { start: r.value.params.dateStart, end: r.value.params.dateFinal },
            });
            this.data = data.map(this.timeEntryParse);
          } catch(err) {
            this.error = err.response;
          }

          this.loading = false;
          r.value.datesGenerate();
          r.value.resultGenerate();
        }, 1000);

        // this.loading = true;
        // this.workedMinutes = 0;

        // try {
        //   const { data } = await clockifyRequest({
        //     url: `/workspaces/${r.value.params.workspaceId}/user/${r.value.user.data.id}/time-entries`,
        //     params: { start: r.value.params.dateStart, end: r.value.params.dateFinal },
        //   });
        //   this.data = data.map(this.timeEntryParse);
        // }
        // catch(err) {
        //   this.error = err.response;
        // }

        // this.workedMinutes = this.data.reduce((a, b) => a + b.workedMinutes, 0);
        // this.loading = false;
      },
      timeEntryParse(entry) {
        entry.workedMinutes = (() => {
          if (!entry.timeInterval.end) {
            return Math.abs($dayjs(entry.timeInterval.start).diff($dayjs(), 'minute'));
          }
    
          return Math.abs($dayjs(entry.timeInterval.start).diff(entry.timeInterval.end, 'minute'));
        })();
        return options.timeEntryParse(entry);
      },
    },

    storage,

    currency: {
      loading: false,
      data: false,
      error: false,
      async load() {
        this.loading = true;

        try {
          const { data } = await $axios.get(`https://api.exchangerate.host/latest?base=${r.value.storage.currencyFrom}`);
          this.data = data.rates;
        } catch(err) {
          this.error = err.response;
        }

        this.loading = false;
      },
    },

    dates: [],

    datesGenerate() {
      let diff = Math.abs($dayjs(r.value.params.dateStart).diff(r.value.params.dateFinal, 'days'));
      this.dates = Array.from(Array(diff+1).keys()).map(days => {
        const dayjs = $dayjs.utc(r.value.params.dateStart).add(days, 'days');
        return {
          id: dayjs.format('YYYY-MM-DD'),
          dayjs,
          is: {
            today: dayjs.format('YYYY-MM-DD') == $dayjs(r.value.params.dateToday).format('YYYY-MM-DD'),
            workingDay: ![0, 6].includes(dayjs.day()),
          },
          entries: r.value.timeEntry.data.filter(entry => {
            return $dayjs(entry.timeInterval.start).format('YYYY-MM-DD') == dayjs.format('YYYY-MM-DD');
          }),
        };
      });
    },

    result: [],

    resultGenerate() {},

    timeHumanize(minutes) {
      return [
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
    },

    dateAdd(n, type) {
      r.value.params.dateStart = $dayjs(r.value.params.dateStart).add(n, type).format('YYYY-MM-DDTHH:mm:ss.000z');
      r.value.params.dateFinal = $dayjs(r.value.params.dateFinal).add(n, type).format('YYYY-MM-DDTHH:mm:ss.000z');
    },

    monthAdd(n) {
      const nextMonthStart = $dayjs(r.value.params.dateFinal).add(n, 'month').startOf('month');
      const nextMonthFinal = $dayjs(nextMonthStart).endOf('month');
      r.value.params.dateStart = nextMonthStart.format('YYYY-MM-DDTHH:mm:ss.000z');
      r.value.params.dateFinal = nextMonthFinal.format('YYYY-MM-DDTHH:mm:ss.000z');
    },

    currencyFormat(number, decimals=2, dsep=',', tsep='.') {
      let [ n1, n2 ] = parseFloat(number).toFixed(decimals).split('.');
      n1 = n1.split('').reverse().join('').replace(/(\d{3})/g, `$1${tsep}`).split('').reverse().join('');
      return [n1, n2].join(dsep).replace(new RegExp(`^\\${tsep}`, 'g'), '');
    },

    currencyConvert(value, format=true) {
      const code = storage.value.currencyTo;
      value = value * r.value.currency.data[ code ] || 1;
      return format ? this.currencyFormat(value) : value;
    },
  });

  (async () => {
    await r.value.user.load();
    await r.value.workspace.load();
    await r.value.timeEntry.load();
    await r.value.currency.load();
    r.value.ready = true;
  })();

  setInterval(async () => {
    r.value.refreshCounter = 59 - parseInt($dayjs().format('s'));

    if (r.value.refreshCounter==0) {
      await r.value.currency.load();
      await r.value.timeEntry.load();
    }
  }, 1000);

  watch([ r.value.params ], async ([ paramsNew ]) => {
    await r.value.currency.load();
    await r.value.timeEntry.load();
  });

  return r;
};