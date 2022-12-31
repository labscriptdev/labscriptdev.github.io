<template>
  <app-layout title="Clockify">
    <div style="overflow:auto;">
      <app-calendar
        :model-value="$route.query.date || dateDefault"
        @update:model-value="redirectQuery({ date: $event })"
        :dates="clockifyUserTimeEntriesItemsCalendar()"
        style="min-width:600px;"
      >
        <template #day="d">
          <div class="py-4">
            <div class="text-h3">{{ d.day }}</div>

            <v-tooltip>
              <template #activator="{ props }">
                <div v-bind="props" v-if="d.dates.length>0">
                  {{ (d.dates.map(dd => dd.timeInterval.durationSeconds).reduce((partial, a) => partial+a)/60/60).toFixed(1) }} hours
                </div>
              </template>

              <div
                v-for="dd in d.dates"
              >
                {{ dd.description }}
              </div>
            </v-tooltip>
          </div>
        </template>
      </app-calendar>
    </div>

    <v-progress-linear
      indeterminate
      v-if="clockifyWorkspaceUserTimeEntriesReq.loading"
    ></v-progress-linear>

    <template #drawer>
      <v-card-title>Clockify</v-card-title>
      <v-divider />

      <v-card-text>
        <v-dialog :persistent="true">
          <template #activator="{ props }">
            <v-btn v-bind="props" block ref="settingsBtn">Configurações</v-btn>
          </template>
  
          <div class="mx-auto" style="width:400px;">
            <v-card>
              <v-card-title>Settings</v-card-title>
              <v-divider />
              <v-card-text>
                Get your access token <a href="https://app.clockify.me/user/settings" target="_blank">here</a>.
                <v-text-field
                  v-model="useStorage.token"
                  label="Clockify token"
                  class="mt-3"
                  type="password"
                  @input="clockifyUserReq.submit()"
                />

                <v-select
                  v-model="useStorage.currencyFrom"
                  label="Currency from"
                  :items="exchangeReq.response"
                  item-value="value"
                  item-title="title"
                  @update:modelValue="settingsCurrencyChange(); exchangeReq.submit();"
                />
                
                <v-select
                  v-model="useStorage.currencyTo"
                  label="Currency to"
                  :items="exchangeReq.response"
                  item-value="value"
                  item-title="title"
                  @update:modelValue="settingsCurrencyChange()"
                />

                <v-text-field
                  v-model.number="useStorage.amountPerHour"
                  label="Amount per hour"
                  type="number"
                  :suffix="`${useStorage.currencyFrom} / Hour`"
                />
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn @click="useStorage = useStorageDefault()">Reset</v-btn>
                <v-spacer />
                <v-btn @click="$refs.settingsBtn.$el.click(); clockifyWorkspacesReq.submit();">Ok</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-dialog>
      </v-card-text>

      <v-divider />

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-select
              label="Workspace"
              :model-value="$route.query.workspaceId || null"
              :items="clockifyWorkspacesReq.response"
              item-value="id"
              item-title="name"
              :loading="clockify.workspace.loading"
              @update:model-value="redirectQuery({ workspaceId: $event })"
              :hide-details="true"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-card>
              <app-calendar
                :model-value="$route.query.date || dateDefault"
                @update:model-value="redirectQuery({ date: $event })"
              ></app-calendar>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="À receber"
              :model-value="$filter.numberFormat(results.amountTotal)"
              :suffix="useStorage.currencyTo"
              readonly
            ></v-text-field>

            <pre>{{ results }}</pre>
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </app-layout>
</template>

<script>
  import axios from 'axios';
  import { useBreakpoints, breakpointsVuetify } from '@vueuse/core';
  import { useStorage, useDebounceFn } from '@vueuse/core';

  export default {
    watch: {
      $route: {deep:true, handler(value, old) {
        this.clockifyRouteChange(value, old);
      }},
    },

    computed: {
      results() {
        const { currencyFrom, currencyTo, amountPerHour } = this.useStorage;
        const durationSeconds = this.clockifyWorkspaceUserTimeEntriesReq.response.durationSeconds;
        const durationHours = durationSeconds / 60 / 60;

        let currencyToAmount = this.exchangeReq.response.filter(item => item.value == currencyTo);
        currencyToAmount = currencyToAmount[0] ? currencyToAmount[0].amount : 1;

        const amountTotal = durationHours * amountPerHour * currencyToAmount;

        return {
          currencyFrom,
          currencyTo,
          amountPerHour,
          durationSeconds,
          durationHours,
          currencyToAmount,
          amountTotal,
        };
      },
    },

    data() {
      const useStorageRef = useStorage('clockify', this.useStorageDefault());
      return {
        breakpoints: useBreakpoints(breakpointsVuetify),
        dateDefault: this.$dayjs().format('YYYY-MM-DD'),
        useStorage: useStorageRef,

        // Currencies
        exchangeReq: this.$request({
          autoSubmit: true,
          url: 'https://api.exchangerate.host/latest',
          params: { base: useStorageRef.value.currencyFrom },
          response: [],
          onResponse: (data) => {
            this.settingsCurrencyChange();
            let items = Object.keys(data.rates).map(attr => {
              return {
                title: `${attr} ${data.rates[ attr ]}`,
                value: attr,
                amount: data.rates[ attr ],
              };
            });
            return items.sort((a, b) => {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            });
          },
        }),

        // Workspaces
        clockifyWorkspacesReq: this.$request({
          autoSubmit: true,
          url: 'clockify://workspaces',
          response: [],
          onBeforeRequest: () => {
            const { workspaceId } = this.$route.query;
            return workspaceId || false;
          },
        }),

        // Logged user
        clockifyUserReq: this.$request({
          url: 'clockify://user',
          onResponse: (data) => {
            this.useStorage.userId = data.id;
            return data;
          },
        }),

        // Time entries
        clockifyWorkspaceUserTimeEntriesReq: this.$request({
          autoSubmit: true,
          url: () => {
            const { workspaceId } = this.$route.query || {};
            const { userId } = this.useStorage;
            return `clockify://workspaces/${workspaceId}/user/${userId}/time-entries`;
          },
          params: () => {
            const dateDefault = this.$route.date || this.$dayjs().format();
            let start = this.$dayjs(dateDefault).format('YYYY-MM-01T00:00:00.000z');
            let end = this.$dayjs(dateDefault).endOf('month').format('YYYY-MM-DDT23:59:59.000z');
            return { start, end };
          },
          response: {
            durationSeconds: 0,
            items: [],
          },
          onBeforeRequest: () => {
            const { workspaceId } = this.$route.query || {};
            const { userId } = this.useStorage;
            return workspaceId && userId;
          },
          onResponse: (data) => {
            let durationSeconds = 0;

            data = data.map((item) => {
              item.timeInterval.durationSeconds = (() => {
                if (!item.timeInterval.end) return 0;
                let diff = this.$dayjs(item.timeInterval.start).diff(item.timeInterval.end);
                return Math.max(diff, diff*-1) / 1000;
              })();
              
              durationSeconds += item.timeInterval.durationSeconds;
              return item;
            });

            return {
              durationSeconds,
              items: data,
            };
          },
        }),

        clockify: {
          workspace: {
            loading: false,
            item: false,
            items: [],
          },
          userTimeEntries: {
            loading: false,
            total: {seconds:0, amount:0, currency:'BRL'},
            params: {
              start: '2022-11-30T00:00:00.000z',
              end: '2022-12-31T00:00:00.000z',
            },
            item: false,
            items: [],
          },
        },
      };
    },

    methods: {
      dateFormat(date, format='DD/MM/YYYY - HH:mm') {
        return this.$dayjs(date).format(format);
      },

      useStorageDefault() {
        return {
          token: '',
          userId: '',
          amountPerHour: 10,
          currencyFrom: 'BRL',
          currencyTo: 'BRL',
        };
      },

      clockifyRouteChange(value, old) {
        const start = this.$dayjs(value.query.date).format('YYYY-MM-01T00:00:00.000z');
        this.clockifyWorkspaceUserTimeEntriesReq.params.start = start;

        const end = this.$dayjs(value.query.date).endOf('month').format('YYYY-MM-DDT23:59:59.000z');
        this.clockifyWorkspaceUserTimeEntriesReq.params.end = end;

        this.clockifyWorkspaceUserTimeEntriesReq.submit();
      },

      clockifyUserTimeEntriesItemsCalendar() {
        let dates = [];

        this.clockifyWorkspaceUserTimeEntriesReq.response.items.forEach(item => {
          dates.push({ date: item.timeInterval.start, ...item });
        });

        return dates;
      },

      redirectQuery(query={}) {
        query = { ...this.$route.query, ...query };
        this.$router.push({ ...this.$route, query });
      },

      settingsCurrencyChange() {
        const { currencyFrom, currencyTo } = this.useStorage;
        this.exchangeReq.params.base = this.useStorage.currencyFrom;
      },
    },
  };
</script>