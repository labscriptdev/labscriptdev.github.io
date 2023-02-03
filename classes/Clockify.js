import axios from 'axios';
import _ from 'lodash';
import { useStorage } from '@vueuse/core';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm:ss.000z';
const DATETIME_FORMAT = `${DATE_FORMAT}T${TIME_FORMAT}`;

export default class {
  constructor(params = {}) {
    const { $dayjs } = useNuxtApp();

    this.ready = false;
    this.date = params.date || $dayjs().startOf('month').format('YYYY-MM-DD');

    this.storage = useStorage('clockify', {
      token: '',
      amountPerHour: 13,
      amountCurrency: "BRL",
      amountGoal: 1000,
      currencyFrom: "AUD",
      currencyTo: "BRL",
    });

    this.workingItem = false;
    this.user = false;

    this.workspace = {
      loading: false,
      item: false,
      items: [],
    };

    this.timeEntry = {
      loading: false,
      items: [],
    };

    this.currency = {
      loading: false,
      params: {
        from: 'AUD',
        to: 'BRL',
      },
      items: [],
    };
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async init() {
    this.ready = false;
    await this.userLoad();
    await this.workspaceLoad();
    await this.timeEntryLoad();
    await this.currenciesLoad();
    this.ready = true;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(async () => {
      const { $dayjs } = useNuxtApp();

      if (0 == parseInt($dayjs().format('s'))) {
        await this.timeEntryLoad();
        await this.currenciesLoad();
      }

      this.timeEntryInterval();
    }, 1000);
  }

  async request(params) {
    return axios.request({
      ...params,
      url: [ 'https://api.clockify.me/api/v1', params.url.replace(/^\/|\/$/g, '') ].join('/'),
      headers: {'X-Api-Key': this.storage.token},
    });
  }

  async userLoad() {
    const { data } = await this.request({ url: '/user' });
    this.user = {
      id: data.id,
      email: data.email,
      name: data.name,
      profilePicture: data.profilePicture,
    };
  }
  
  async workspaceLoad() {
    this.workspace.loading = true;
    const { data: workspaceItems } = await this.request({
      url: '/workspaces',
    });

    this.workspace.items = workspaceItems;
    if (this.workspace.items.length==1) {
      this.workspace.item = this.workspace.items[0];
    }

    this.workspace.loading = false;
  }

  async timeEntryLoad() {
    const { $dayjs } = useNuxtApp();

    if (this.timeEntry.loading) {
      clearTimeout(this.timeEntry.loading);
    }

    this.timeEntry.loading = setTimeout(async () => {
      if (!this.user) return;
      if (!this.workspace.item) return;
  
      const { data } = await this.request({
        url: `/workspaces/${this.workspace.item.id}/user/${this.user.id}/time-entries`,
        params: {
          start: $dayjs(this.date).startOf('month').format(DATETIME_FORMAT),
          end: $dayjs(this.date).endOf('month').format(DATETIME_FORMAT),
        },
      });
  
      this.timeEntry.items = data.map(item => {
        item.workedMinutes = (() => {
          if (!item.timeInterval.end) return 0;
          let diff = $dayjs(item.timeInterval.start).diff(item.timeInterval.end);
          return Math.max(diff, diff*-1) / 1000 / 60;
        })();

        return item;
      });

      this.timeEntry.loading = false;
    }, 1000);
  }

  getDays() {
    const { $dayjs } = useNuxtApp();
    const today = $dayjs(this.date);
    let days = [];

    for(let day = 1; day <= $dayjs(this.date).daysInMonth(); day++) {
      const dd = $dayjs(this.date).set('date', day);
      const date = dd.format(DATE_FORMAT);
      const isFuture = dd.isAfter(today);
      const isPast = dd.isBefore(today);
      const entries = this.timeEntry.items.filter(item => {
        return item.timeInterval.start.startsWith(date);
      });
      days.push({ day, date, isFuture, isPast, entries });
    }

    return days;
  }

  async timeEntryInterval() {
    const { $dayjs } = useNuxtApp();
    const dateNow = $dayjs();

    this.workingItem = false;
    this.timeEntry.items.forEach(entry => {
      if (entry.timeInterval.end) return;
      const diff = dateNow.diff(entry.timeInterval.start) / 1000 / 60;
      entry.workedMinutes = diff;
      this.workingItem = entry;
    });
  }

  async currenciesLoad() {
    this.currency.loading = true;
    const { data } = await axios.get(`https://api.exchangerate.host/latest?base=${this.storage.currencyFrom}`);
    this.currency.items = Object.entries(data.rates).map(([code, value]) => ({ code, value }));
    this.currency.loading = false;
  }

  currencyConverted(value, code=null) {
    const currencyTo = _.head(this.currency.items.filter(item => item.code == this.storage.currencyTo)) || {code:'000', value:1};
    return value * currencyTo.value;
  }

  result() {
    const { $dayjs } = useNuxtApp();
    const workedMinutes = this.timeEntry.items.reduce((total, item) => total + item.workedMinutes, 0);
    const amount = this.storage.amountPerHour * (workedMinutes / 60);
    const amountGoalPercent = amount / this.storage.amountGoal * 100;
    const amountDaysPercent = $dayjs().date() / $dayjs().daysInMonth() * 100;
    const goalWorkDaysAvg = (() => {
      const daysToEnd = Math.max(1, $dayjs().daysInMonth() - $dayjs().date());
      const amountMissing = this.storage.amountGoal - amount;
      const hoursToWork = amountMissing / this.storage.amountPerHour;
      return Math.ceil(hoursToWork / daysToEnd);
    })();

    const days = this.getDays();

    return {
      workedMinutes,
      amount,
      amountGoalPercent,
      amountDaysPercent,
      goalWorkDaysAvg,
      days,
    };
  }
};