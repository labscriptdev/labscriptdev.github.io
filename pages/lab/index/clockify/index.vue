<template>
  <app-layout title="Clockify" container-width="100%">
    <v-select label="Display" v-model="calendarDisplay" :items="['year', 'month', 'week', 'range']"></v-select>
    <pre>{{ { dateStart, dateFinal } }}</pre>
    <app-calendar
      v-model="clockify.date"
      :layout="calendarDisplay"
      :dates="clockify.timeEntry.items.map(item => ({ date: item.timeInterval.start, ...item }))"
      v-model:dateStart="dateStart"
      v-model:dateFinal="dateFinal"
    >
      <template #day="d" v-if="calendarDisplay=='range'">
        <div class="bg-grey-lighten-4">
          <div class="text-h6 text-center py-4">{{ d.day }}</div>
          <div class="d-flex flex-column justify-end bg-grey-lighten-3" style="height:300px; gap:2px;">
            <div
              v-for="dd in d.dates"
              :style="`height: ${dd.workedMinutes / 1440 * 100}%; background:red;`"
              class="bg-grey-lighten-2"
            >
              <pre>{{ (dd.workedMinutes / 60 % 60).toFixed(2) }}hs</pre>
            </div>
          </div>
          <div class="text-center">
            {{ (d.dates.reduce((total, dd) => (total+dd.workedMinutes), 0) / 60).toFixed(2) }}hs
          </div>
        </div>
      </template>
    </app-calendar>

    <!-- <div class="d-flex" style="gap:3px;">
      <template v-for="d in result.days">
        <div
          class="d-flex flex-column"
          :class="{
            'bg-green-lighten-3': d.isPast,
            'bg-grey-lighten-1': d.isFuture,
          }"
          :title="d.context"
          style="width:calc(100% / 31); height:200px; gap:3px;"
        >
          <div class="text-center">{{ d.day }}</div>
          <div class="text-center">{{ d.weekday }}</div>
          <div class="flex-grow-1">{{ d.context }}</div>
          <div class="text-center bg-primary" v-for="e in d.entries" style="height:5px;"></div>
        </div>
      </template>
    </div> -->

    <!-- <app-dd v-model="clockify"></app-dd> -->
    <!-- <pre>{{ result }}</pre> -->

    <template #drawer>
      <template v-if="clockify.ready">
        <v-card-text>
          <div class="fw-bold">{{ clockify.user.name }}</div>
        </v-card-text>
        <v-divider />
      </template>

      <!-- Settings -->
      <v-card-text>
        <v-dialog>
          <template #activator="{ props }">
            <v-btn block v-bind="props" ref="settings">
              <v-icon class="me-2">mdi-cog</v-icon>
              Settings
            </v-btn>
          </template>

          <div style="width:90vw; max-width:600px!important; margin:0 auto;">
            <v-card>
              <v-card-text>
                Get your access token <a href="https://app.clockify.me/user/settings" target="_blank">here</a>. <br><br>
                <v-text-field
                  label="Token"
                  v-model="clockify.storage.token"
                />

                <div class="d-flex align-center mb-6" style="gap:15px;">
                  <v-text-field
                    label="Converter de"
                    v-model.number="clockify.storage.amountPerHour"
                    type="number"
                    :hide-details="true"
                  />

                  <v-autocomplete
                    v-model="clockify.storage.currencyFrom"
                    :items="clockify.currency.items.map(item => item.code)"
                    :hide-details="true"
                    style="width:150px;"
                  ></v-autocomplete>

                  <v-autocomplete
                    label="Para"
                    v-model="clockify.storage.currencyTo"
                    :items="clockify.currency.items.map(item => item.code)"
                    :hide-details="true"
                    style="width:150px;"
                  ></v-autocomplete>
                </div>

                <v-text-field
                  :label="`Meta (${clockify.storage.currencyFrom})`"
                  v-model.number="clockify.storage.amountGoal"
                  type="number"
                  :hide-details="true"
                  :suffix="`${$filter.numberFormat(clockify.currencyConverted(clockify.storage.amountGoal))} ${clockify.storage.currencyTo}`"
                />
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn @click="$refs.settings.$el.click(); clockify.init();">Ok</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-dialog>
      </v-card-text>

      <v-divider />
      <v-card-text>
        <app-calendar
          v-model="clockify.date"
          @update:modelValue="clockify.timeEntryLoad()"
        ></app-calendar>
      </v-card-text>

        <v-divider />
        <v-card-text>
          <v-text-field
            :label="`À receber (${clockify.storage.currencyFrom})`"
            :model-value="$filter.numberFormat(result.amount)"
            :suffix="`${$filter.numberFormat(clockify.currencyConverted(result.amount))} ${clockify.storage.currencyTo}`"
            readonly
          />

          <div class="d-flex flex-column" style="gap: 15px;">
            <v-progress-linear
              :model-value="result.amountGoalPercent"
              :color="result.amountGoalPercent>result.amountDaysPercent? 'success': 'error'"
              height="22"
            >Meta: {{ $filter.numberFormat(clockify.storage.amountGoal) }} {{ clockify.storage.currencyFrom }}</v-progress-linear>

            <v-progress-linear
              :model-value="result.amountDaysPercent"
              color="success"
              height="22"
            >Fim do mês</v-progress-linear>

            <v-alert>Você precisa trabalhar <strong>{{ result.goalWorkDaysAvg }} horas por dia</strong> para bater a meta.</v-alert>
            
            <v-alert icon="mdi-clock-outline" color="success" v-if="clockify.workingItem">
              <div>Em andamento:</div>
              <div class="text-uppercase"><strong>{{ clockify.workingItem.description }}</strong></div>
              <div><small>{{ $filter.dateTimeago(clockify.workingItem.workedMinutes * 60) }}</small></div>
            </v-alert>
          </div>
        </v-card-text>
    </template>
  </app-layout>
</template>

<script>
  import Clockify from '@/classes/Clockify';
  // import useClockify from '@/composables/useClockify';

  export default {
    meta: {
      active: true,
      icon: 'mdi-alarm-check',
      name: 'Clockify',
      description: 'Gerenciamento e cálculo de horas trabalhadas utilizando o app Clockify',
    },

    mounted() {
      this.clockify.init();

      definePageMeta({
        title: 'Aaa'
      });
    },

    beforeUnmount() {
      this.clockify.destroy();
    },

    computed: {
      result() {
        return this.clockify.result();
      },
    },

    data() {
      return {
        calendarDisplay: 'range',
        dateStart: false,
        dateFinal: false,
        clockify: new Clockify(),
      };
    },
  };
</script>