<template>
  <app-layout title="Clockify" container-width="100%">
    <div
      class="overflow-auto"
      ref="scroll"
      @wheel.prevent.stop="$refs.scroll.scroll({ left: $refs.scroll.scrollLeft + $event.deltaY*4, top: 0, behavior: 'smooth' });"
    >
      <div class="d-flex" style="gap:5px;">
        <template v-for="d in clockify2.dates">
          <div
            class="d-flex flex-column border"
            :class="{
              'bg-green-lighten-4': d.is.today,
              'bg-grey-lighten-4': !d.is.today,
            }"
            style="gap:2px; padding:2px; min-width:60px; height:250px;"
          >
            <div
              class="text-center py-2 fw-bold"
              :class="{
                'bg-green-lighten-2': d.is.today,
                'bg-grey-lighten-2': !d.is.today,
              }"
              style="font-size:12px;"
            >
              <div>{{ d.date.format('ddd') }}</div>
              <div>{{ d.date.format('DD') }}</div>
            </div>
            <div class="flex-grow-1 d-flex flex-column justify-end" style="gap:3px;">
              <div
                v-for="e in d.entries"
                :title="`${e.description} - ${e.workedMinutes} minutes worked`"
                class="text-center overflow-hidden"
                :class="{
                  'bg-green-lighten-2': (clockify2.timeEntry.working && clockify2.timeEntry.working.id==e.id),
                  'bg-grey-lighten-2': !(clockify2.timeEntry.working && clockify2.timeEntry.working.id==e.id),
                }"
                :style="{ height: `${e.workedMinutesPercent}%` }"
                style="font-size:12px; white-space:nowrap;"
              >
                {{ clockify2.timeHumanize(e.workedMinutes) }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="d-flex flex-column" style="gap:5px;">
      <v-progress-linear
        :model-value="clockify2.result.rangeWorkWorkedPercent.value"
        color="light-green-darken-4"
        height="16"
        :striped="!!clockify2.timeEntry.working"
        style="font-size:10px;"
        rounded
      >
        {{ clockify2.result.rangeWorkWorkedPercent.description }}
      </v-progress-linear>
  
      <v-progress-linear
        :model-value="clockify2.result.amountGoalPercent.value"
        color="light-green-darken-4"
        height="16"
        :striped="!!clockify2.timeEntry.working"
        style="font-size:10px;"
        rounded
      >
        {{ clockify2.result.amountGoalPercent.description }}
      </v-progress-linear>
    </div>

    <br>

    <v-alert color="success" v-if="clockify2.timeEntry.working">
      <div>Working:</div>
      <div>{{ clockify2.timeEntry.working.description }}</div>
      <div>{{ clockify2.timeEntry.working.workedMinutes }} minutos</div>
    </v-alert>

    <br>

    <v-card>
      <v-table>
        <tbody>
          <tr v-for="([k, r]) in Object.entries(clockify2.result)">
            <!-- <td>{{ k }}</td> -->
            <td>{{ r.description }}</td>
            <!-- <td>{{ r.value }}</td> -->
            <td>{{ r.formatted }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <br>

    <!-- <v-row no-gutter>
      <v-col cols="4" class="overflow-auto">
        <v-text-field v-model="clockify2.dateStart" label="Start" />
        <v-text-field v-model="clockify2.dateFinal" label="Final" />
        <pre>{{ clockify2.timeHumanize(100) }}</pre>
        <pre>clockify2.currency: {{ clockify2.currency }}</pre>
        <pre>clockify2.result: {{ clockify2.result }}</pre>
        <pre>clockify2.dates: {{ clockify2.dates }}</pre>
      </v-col>
    </v-row> -->

    <template #drawer>
      <template v-if="clockify2.user.data">
        <v-card-text>
          <div class="d-flex align-center">
            <v-avatar>
              <v-img :src="clockify2.user.data.profilePicture"></v-img>
            </v-avatar>
            <div class="fw-bold ms-3">{{ clockify2.user.data.name }}</div>
            <v-dialog>
              <template #activator="{ props }">
                <v-btn
                  icon="mdi-cog"
                  class="ms-auto"
                  flat
                  size="20"
                  v-bind="props"
                  ref="settingsBtn"
                />
              </template>
    
              <div style="width:90vw; max-width:600px!important; margin:0 auto;">
                <v-card>
                  <v-card-text>
                    <a href="https://app.clockify.me/user/settings" target="_blank">
                      Acesse sua tela de configurações Clockify para gerar o token.
                    </a><br><br>
                    <v-text-field
                      label="Token"
                      v-model="clockify2.storage.token"
                      :class="{ 'security-mode': clockify2.storage.securityMode }"
                    />
    
                    <div class="d-flex align-center mb-6" style="gap:15px;">
                      <v-text-field
                        label="Converter de"
                        v-model.number="clockify2.storage.amountPerHour"
                        type="number"
                        :hide-details="true"
                      />
    
                      <v-autocomplete
                        v-model="clockify2.storage.currencyFrom"
                        :items="Object.keys(clockify2.currency.rates)"
                        :hide-details="true"
                        style="width:150px;"
                      ></v-autocomplete>
    
                      <v-autocomplete
                        label="Para"
                        v-model="clockify2.storage.currencyTo"
                        :items="Object.keys(clockify2.currency.rates)"
                        :hide-details="true"
                        style="width:150px;"
                      ></v-autocomplete>
                    </div>
    
                    <v-text-field
                      :label="`Meta (${clockify2.storage.currencyFrom})`"
                      v-model.number="clockify2.storage.amountGoal"
                      type="number"
                      :hide-details="true"
                      :suffix="`${clockify2.currencyConvert(clockify2.storage.amountGoal)} ${clockify2.storage.currencyTo}`"
                      :class="{ 'security-mode': clockify2.storage.securityMode }"
                    />

                    <v-switch
                      v-model="clockify2.storage.securityMode"
                      hide-details
                      :label="clockify2.storage.securityMode? 'Hidden': 'Shown'"
                    ></v-switch>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn @click="$refs.settingsBtn.$el.click();">Ok</v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </v-dialog>
          </div>
        </v-card-text>
        <v-divider />
      </template>

      <v-divider />
      <v-card-text>
        <v-text-field
          :class="{ 'security-mode': clockify2.storage.securityMode }"
          :label="`À receber (${clockify2.storage.currencyFrom})`"
          :model-value="clockify2.currencyFormat(clockify2.result.amountTotal.value)"
          :suffix="`${clockify2.currencyConvert(clockify2.result.amountTotal.value)} ${clockify2.storage.currencyTo}`"
          readonly
        />
      </v-card-text>
    </template>
  </app-layout>
</template>

<style>
  .security-mode {
    filter: blur(4px);
  }
</style>

<script>
  import Clockify from '@/classes/Clockify';
  import useClockify from '@/composables/useClockify';
  import useCalendar from '@/composables/useCalendar';
  import useCurrency from '@/composables/useCurrency';

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
        clockify2: useClockify({
          timeEntryParse(entry) {
            entry.workedMinutesPercent = Math.min(100, entry.workedMinutes / (60 * 14) * 100);
            return entry;
          },
        }),
        calendarDate: useCalendar(),
        calendarRange: useCalendar({
          rangeStart: '2023-01-01T00:00:00.000Z',
          rangeFinal: '2023-01-05T00:00:00.000Z',
        }),
        calendarDisplay: 'range',
        dateStart: false,
        dateFinal: false,
        clockify: new Clockify(),
      };
    },
  };
</script>