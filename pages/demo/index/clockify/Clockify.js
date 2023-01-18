import axios from 'axios';
import _ from 'lodash';
import { useStorage } from '@vueuse/core';

export default class {
  constructor(params = {}) {
    const { $dayjs } = useNuxtApp();

    this.ready = false;
    this.date = params.date || $dayjs().startOf('month').format('YYYY-MM-DD');

    this.storage = useStorage('clockify', {
      token: '',
      amountPerHour: 13,
      amountCurrency: "BRL",
      currencyFrom: "AUD",
      currencyTo: "BRL",
    });

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

  async init() {
    this.ready = false;
    await this.userLoad();
    await this.workspaceLoad();
    await this.timeEntryLoad();
    await this.currenciesLoad();
    this.ready = true;
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
          start: $dayjs(this.date).startOf('month').format('YYYY-MM-DDTHH:mm:ss.000z'),
          end: $dayjs(this.date).endOf('month').format('YYYY-MM-DDTHH:mm:ss.000z'),
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

  async currenciesLoad() {
    this.currency.loading = true;
    const { data } = await axios.get('https://api.exchangerate.host/latest?base=USD');
    this.currency.items = Object.entries(data.rates).map(([code, value]) => ({ code, value }));
    this.currency.loading = false;
  }

  amountConvert(value) {
    const from = {code:'AUD', value:1.43};
    const to = {code:'BRL', value:5.10};
    // const from = _.head(this.currency.items.filter(item => item.code == this.storage.currencyFrom)) || {code:'000', value:1};
    // const to = _.head(this.currency.items.filter(item => item.code == this.storage.currencyTo)) || {code:'000', value:1};
    const expected = 2752.16;
    const result = value * to.value / from.value;
    console.clear();
    console.log(JSON.stringify({ value, expected, result, from, to }, ' ', 2));
    return value;
  }

  result() {
    const minutes = this.timeEntry.items.reduce((total, item) => total + item.workedMinutes, 0);
    const amount = this.storage.amountPerHour * (minutes / 60);
    // worked.amountConverted = this.amountConvert(worked.amount);

    return {
      minutes,
      amount,
    };
  }
};