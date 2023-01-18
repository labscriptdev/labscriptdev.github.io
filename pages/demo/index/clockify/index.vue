<template>
  <app-layout title="Clockify" container-width="100%">
    <app-calendar
      v-model="clockify.date"
      :dates="clockify.timeEntry.items.map(item => ({ date: item.timeInterval.start, ...item }))"
    >
      <template #day="d">
        <div class="text-h3 py-4">{{ d.day }}</div>
        <div>
          {{ (d.dates.reduce((total, dd) => (total+dd.workedMinutes), 0) / 60).toFixed(2) }}
        </div>
      </template>
    </app-calendar>

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

                <div class="d-flex align-center" style="gap:15px;">
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
            label="À receber"
            :model-value="$filter.numberFormat(result.from.amount)"
            :suffix="result.from.currency"
            readonly
          />
          
          <v-text-field
            label="À receber"
            :model-value="$filter.numberFormat(result.to.amount)"
            :suffix="result.to.currency"
            readonly
          />

          <v-alert icon="mdi-clock-outline" color="success" v-if="clockify.clockActive">
            Tarefa em andamento
          </v-alert>
        </v-card-text>
    </template>
  </app-layout>
</template>

<script>
  import Clockify from './Clockify';

  export default {
    mounted() {
      this.clockify.init();
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
        clockify: new Clockify(),
      };
    },
  };
</script>