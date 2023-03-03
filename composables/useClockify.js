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
    invoiceNumber: '',
    invoiceContractorInfo: '',
    invoiceProviderName: '',
    invoiceProviderInfo: '',
    invoiceProviderServiceDescription: '',
    invoiceProviderFeeDescription: '',
    invoiceFeeHusky: 0.02,
    invoiceThanks: '',
    invoiceProviderAccountAddress: '',
    invoiceProviderAccountIban: '',
    invoiceProviderAccountSwiftCode: '',
    invoiceProviderAccountBankName: '',
    invoiceProviderAccountBankAddress: '',
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
        this.data = false;

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
        this.data = [];

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
          this.data = [];

          try {
            const { data } = await clockifyRequest({
              url: `/workspaces/${r.value.params.workspaceId}/user/${r.value.user.data.id}/time-entries`,
              params: { start: r.value.params.dateStart, end: r.value.params.dateFinal },
            });
            this.data = data.map(this.timeEntryParse);
            this.workedMinutes = this.data.reduce((a, b) => a + b.workedMinutes, 0);
          } catch(err) {
            this.error = err.response;
          }

          this.loading = false;
          r.value.datesGenerate();
          r.value.resultGenerate();
          r.value.chartsGenerate();
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
      data: {},
      error: false,
      async load() {
        this.loading = true;
        this.data = {};

        try {
          const { data } = await $axios.get(`https://api.exchangerate.host/latest?base=${r.value.storage.currencyFrom}`);
          this.data = data.rates;
        } catch(err) {
          this.error = err.response;
        }

        this.loading = false;
      },
    },

    rangeDays() {
      let diff = Math.abs($dayjs(r.value.params.dateStart).diff(r.value.params.dateFinal, 'days'));
      return Array.from(Array(diff+1).keys()).map(days => {
        return $dayjs.utc(r.value.params.dateStart).add(days, 'days');
      });
    },

    dates: [],

    datesGenerate() {
      this.dates = this.rangeDays().map(dayjs => {
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

    result: {
      ready: false,
    },

    resultGenerate() {
      const workingDays = this.rangeDays().filter(dayjs => {
        return ![0, 6].includes(dayjs.day());
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

      let result = { ready: true };

      result.rangeWorkExpected = dataItem({
        description: `Tempo total esperado para trabalhar (${workingDays.length} dias úteis)`,
        value: 60 * 8 * workingDays.length,
        formatted: (me) => `${(me.value/60).toFixed(0)} horas`,
      });
  
      result.rangeWorkWorked = dataItem({
        description: 'Tempo total trabalhado',
        value: r.value.timeEntry.workedMinutes,
        formatted: (me) => `${(me.value/60).toFixed(0)} horas`,
      });
  
      result.rangeWorkWorkedPercent = dataItem({
        description: (me) => `${me.value.toFixed(0)}% do mês trabalhado`,
        value: result.rangeWorkWorked.value / result.rangeWorkExpected.value * 100,
        formatted: me => me.value.toFixed(0)+'%',
      });
  
      result.amountTotal = dataItem({
        description: `Total para receber`,
        value: (r.value.timeEntry.workedMinutes / 60) * r.value.storage.amountPerHour,
        formatted: (me) => `${this.currencyFormat(me.value)} (${r.value.storage.currencyFrom}) / ${this.currencyConvert(me.value)} (${r.value.storage.currencyTo})`,
      });
      
      result.amountFee = dataItem({
        description: `Taxas`,
        value: result.amountTotal.value * parseFloat(r.value.storage.invoiceFeeHusky || 0),
        formatted: (me) => `${this.currencyFormat(me.value)} (${r.value.storage.currencyFrom}) / ${this.currencyConvert(me.value)} (${r.value.storage.currencyTo})`,
      });
  
      result.rangeWorkDayAverage = dataItem({
        description: (me) => `Quantidade de horas diárias para alcançar a meta`,
        value: (me) => {
          const daysToEnd = Math.abs($dayjs().diff(r.value.params.dateFinal, 'days'));
          const amountMissing = r.value.storage.amountGoal - result.amountTotal.value;
          const hoursToWork = amountMissing / r.value.storage.amountPerHour;
          return Math.ceil(hoursToWork / daysToEnd);
        },
        formatted: me => `${me.value} horas / dia`,
      });
  
      result.amountGoal = dataItem({
        description: `Meta mensal`,
        value: r.value.storage.amountGoal,
        formatted: (me) => `${this.currencyFormat(me.value)} (${r.value.storage.currencyFrom}) / ${this.currencyConvert(me.value)} (${r.value.storage.currencyTo})`,
      });
      
      result.amountGoalPercent = dataItem({
        description: (me) => `${me.value.toFixed(0)}% do valor da meta alcançada`,
        value: result.amountTotal.value / r.value.storage.amountGoal * 100,
        formatted: me => me.value.toFixed(0)+'%',
      });

      this.result = result;
    },

    charts: [],

    chartsGenerate() {
      const chartDefault = (params = {}) => {
        params = {
          name: 'No name',
          colBind: { cols: 12 },
          type: 'bar',
          data: {},
          options: {},
          ...params
        };

        for(let i in params) {
          if (typeof params[i]=='function') {
            params[i] = params[i]();
          }
        }

        return {
          name: params.name,
          colBind: params.colBind,
          chartBind: {
            type: params.type,
            data: params.data,
            options: params.options,
          },
        };
      };

      let charts = [];

      charts.push(chartDefault({
        name: 'Tarefas',
        colBind: { cols: 12 },
        type: 'bar',
        options: {
          responsive: true,
          plugins: {
            legend: { display: false, position: 'top' },
            title: { display: true, text: 'Tarefas' },
            tooltip: {
              callbacks: {
                title: () => false,
                label: (chart) => ' '+ chart.dataset.label,
                footer: (items) => {
                  return '     '+ items.map(item => item.raw).join('') +' horas';
                },
              },
            },
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          },
        },
        data: () => {
          const labels = this.dates.map(item => item.dayjs.format('DD'));

          let datasets = [];

          Object.entries(this.dates).forEach(([ i, date]) => {
            Object.entries(date.entries).forEach(([ ii, entry ]) => {
              let data = this.dates.map((item, index) => {
                if (index!=i) return 0;
                return entry.workedMinutes / 60;
              });
              datasets.push({ label: entry.description, data });
            });
          });

          // console.log(JSON.stringify({ labels, datasets }, ' ', 2));
          return { labels, datasets };
        },
      }));

      charts.push(chartDefault({
        name: 'Horas trabalhadas',
        type: 'bar',
        options: {
          responsive: true,
          bezierCurve: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Horas trabalhadas' },
            tooltip: {
              callbacks: {
                title: (items) => {
                  const minutes = items.reduce((total, a) => total + a.raw, 0) % 60 * 60;
                  return `${minutes} minutos`;
                },
              },
            },
          },
        },
        data: () => {
          const labels = this.dates.map(item => item.dayjs.format('DD'));
          const datasetData = this.dates.map(item => {
            const workedMinutes = item.entries.reduce((total, item) => {
              return total + item.workedMinutes;
            }, 0);

            return workedMinutes / 60;
          });
          return { labels, datasets: [
            {
              label: 'Horas trabalhadas',
              tension: .3,
              data: datasetData,
              backgroundColor: (context) => {
                return context.raw >= 8 ? 'green' : 'red';
              },
              // backgroundColor: (c) => '#' + (Math.random().toString(16) + '0000000').slice(2, 8),
            },
          ]};
        },
      }));
      
      // charts.push(chartDefault({
      //   name: 'Meta financeira',
      //   colBind: { cols: 12, lg: 4 },
      //   type: 'line',
      //   options: {
      //     plugins: {
      //       legend: { position: 'top' },
      //       title: { display: true, text: 'Meta financeira' },
      //     },
      //   },
      //   data: {},
      // }));

      // charts.push(chartDefault({
      //   name: 'Mês trabalhado',
      //   colBind: { cols: 12, lg: 4 },
      //   type: 'line',
      //   options: {
      //     plugins: {
      //       legend: { position: 'top' },
      //       title: { display: true, text: 'Mês trabalhado' },
      //     },
      //   },
      //   data: {},
      // }));

      // charts.push(chartDefault({
      //   name: 'AUD > BRL',
      //   colBind: { cols: 12, lg: 4 },
      //   type: 'line',
      //   options: {
      //     plugins: {
      //       legend: { position: 'top' },
      //       title: { display: true, text: 'AUD > BRL' },
      //     },
      //   },
      //   data: {},
      // }));

      this.charts = charts;
    },

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

    async init() {
      await r.value.user.load();
      await r.value.workspace.load();
      await r.value.timeEntry.load();
      await r.value.currency.load();
      r.value.ready = true;
    },
  });

  r.value.init();

  const interval = setInterval(async () => {
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

  watch([ r.value.storage ], async ([ storageNew ]) => {
    r.value.datesGenerate();
    r.value.resultGenerate();
    r.value.chartsGenerate();
  });

  onMounted(() => {});

  onUnmounted(() => {
    clearInterval(interval);
  });

  return r;
};