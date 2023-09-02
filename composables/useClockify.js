import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useStorage } from '@vueuse/core';

import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';

export default function(options = {}) {
  const { $dayjs, $axios } = useNuxtApp();
  $dayjs.extend(duration);
  $dayjs.extend(relativeTime);

  options = {
    storageKey: 'clockify',
    params: {},
    timeEntryParse: (entry) => entry,
    onDateChange: () => {},
    ...options
  };

  options.params = {
    month: null,
    dateStart: null,
    dateFinal: null,
    dateToday: null,
    workspaceId: null,
    ...options.params
  };

  if (options.params.month===null) {
    options.params.month = $dayjs().startOf('month').format('YYYY-MM');
  }

  if (options.params.dateStart===null) {
    options.params.dateStart = $dayjs().startOf('month').format(`${options.params.month}-DDTHH:mm:ss.000z`);
  }
  
  if (options.params.dateFinal===null) {
    options.params.dateFinal = $dayjs().endOf('month').format(`${options.params.month}-DDTHH:mm:ss.000z`);
  }
  
  if (options.params.dateToday===null) {
    options.params.dateToday = $dayjs().format('YYYY-MM-DDTHH:mm:ss.000z');
  }

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
              params: {
                start: r.value.params.dateStart,
                end: r.value.params.dateFinal,
                'page-size': 100,
              },
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
        if (this.loading) {
          clearTimeout(this.loading);
        }

        this.loading = setTimeout(async () => {
          this.data = {};
  
          try {
            const { data } = await $axios.get(`https://api.exchangerate.host/latest?base=${r.value.storage.currencyFrom}`);
            this.data = data.rates;
          } catch(err) {
            this.error = err.response;
          }
  
          this.loading = false;
        }, 1000);
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
            // console.log({ entry, dayjs });
            
            // console.log('----------------------------------');
            // console.log('$dayjs', entry.timeInterval.start.substring(0, 10));
            // console.log(' dayjs', dayjs.format('YYYY-MM-DD'));
            // console.log(' equal', dayjs.format('YYYY-MM-DD')==entry.timeInterval.start.substring(0, 10));

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

    chart: {},

    chartsGenerate() {
      const chartDefault = (params = {}) => {
        params = {
          name: 'No name',
          type: 'bar',
          data: {},
          options: {},
          chartLoad: () => {},
          ...params
        };

        for(let i in params) {
          if (typeof params[i]=='function') {
            if (i=='chartLoad') continue;
            params[i] = params[i]();
          }
        }

        return {
          name: params.name,
          chartLoad: params.chartLoad,
          chartBind: {
            type: params.type,
            data: params.data,
            options: params.options,
          },
        };
      };

      let chart = {};

      // Tarefas / dia
      chart.tasksPerDay = chartDefault({
        name: 'Tarefas',
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
          const labels = this.dates.map(item => item.dayjs.format('DD ddd'));

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

          return { labels, datasets };
        },
      });

      // Horas tarefa /dia
      chart.hourPerDay = chartDefault({
        name: 'Tarefas',
        type: 'bar',
        options: {
          responsive: true,
          plugins: {
            legend: { display: false, position: 'top' },
            title: { display: true, text: 'Tarefas' },
          },
        },
        data: () => {
          const labels = this.dates.map(item => item.dayjs.format('DD ddd'));

          const datasets = [{
            label: 'Aaa',
            data: this.dates.map(item => {
              return item.entries.reduce((total, entry) => {
                return (entry.workedMinutes / 60) + total;
              }, 0);
            }),
          }];

          return { labels, datasets };
        },
      });
      
      // TODO: Marcar se valor da moeda está subindo ou caindo
      chart.exchange = chartDefault({
        name: 'Exchange',
        type: 'line',
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Exchange' },
          },
        },
        data: {},
        chartLoad: async (chart) => {
          chart.data.labels = this.dates.map(item => item.dayjs.format('DD ddd'));

          const params = {
            start_date: $dayjs(this.params.dateStart).format('YYYY-MM-DD'),
            end_date: $dayjs(this.params.dateFinal).format('YYYY-MM-DD'),
            symbols: `${this.storage.currencyFrom},${this.storage.currencyTo}`,
          };

          const { data } = await axios.get('https://api.exchangerate.host/timeseries', { params });
          
          chart.data.datasets = [
            {
              label: this.storage.currencyFrom,
              data: Object.values(data.rates).map(rate => rate[ this.storage.currencyFrom ] || null),
              tension: 0.3,
            },
            {
              label: this.storage.currencyTo,
              data: Object.values(data.rates).map(rate => rate[ this.storage.currencyTo ] || null),
              tension: 0.3,
            },
          ];

          chart.update();
        },
      });

      chart.targetValue = chartDefault({
        name: 'Meta x valor alcançado',
        type: 'bar',
        options: {
          responsive: true,
          indexAxis: 'y',
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Meta x valor alcançado' },
          },
        },
        data: () => {
          const labels = [''];
          const datasets = [
            { label: 'Total', data: [ this.storage.amountGoal ], },
            { label: 'Alcançado', data: [ this.result.amountTotal.value ], },
          ];
          return { labels, datasets };
        },
      });

      this.chart = chart;
    },

    counter: {
      interval: false,
      time: 59,
      async init() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(async () => {
          this.time--;
  
          if (this.time <= 0) {
            await r.value.currency.load();
            await r.value.timeEntry.load();
            this.time = 59;
          }
        }, 1000);
      },
      async restart() {
        this.time = 0;
        return await this.init();
      },
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
      r.value.params.month = nextMonthStart.format('YYYY-MM');
      r.value.params.dateStart = nextMonthStart.format('YYYY-MM-DDTHH:mm:ss.000z');
      r.value.params.dateFinal = nextMonthFinal.format('YYYY-MM-DDTHH:mm:ss.000z');
      options.onDateChange(r.value);
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
      await r.value.counter.init();
      r.value.ready = true;
    },
  });

  r.value.init();

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
    clearInterval(r.value.counter.interval);
  });

  return r;
};