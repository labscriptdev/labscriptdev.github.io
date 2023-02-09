<template>
  <app-layout title="Clockify" container-width="100%">
    <div
      class="overflow-auto"
      ref="scroll"
      @wheel.prevent.stop="$refs.scroll.scroll({ left: $refs.scroll.scrollLeft + $event.deltaY*4, top: 0, behavior: 'smooth' });"
    >
      <div class="d-flex" style="gap:5px;">
        <template v-for="d in clockify.dates">
          <div
            class="d-flex flex-column border"
            :class="{
              'bg-green-lighten-4': d.is.today,
              'bg-grey-lighten-4': !d.is.today,
            }"
            style="gap:2px; padding:2px; min-width:70px; max-width:70px; height:300px;"
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
              <div style="white-space:nowrap; font-size:10px;">&nbsp; {{ clockify.timeHumanize(d.entries.reduce((a, b) => a + b.workedMinutes, 0)) }}</div>
            </div>
            <div class="flex-grow-1 d-flex flex-column justify-end" style="gap:3px;">
              <div
                v-for="e in d.entries"
                :title="`${e.description} - ${e.workedMinutes} minutes worked`"
                class="text-center overflow-hidden d-flex align-center justify-center"
                :class="{
                  'bg-green-lighten-2': (clockify.timeEntry.working && clockify.timeEntry.working.id==e.id),
                  'bg-grey-lighten-2': !(clockify.timeEntry.working && clockify.timeEntry.working.id==e.id),
                }"
                :style="{ height: `${e.workedMinutesPercent}%` }"
                style="font-size:10px; white-space:nowrap;"
              >
                <div>
                  {{ clockify.timeHumanize(e.workedMinutes) }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <br>

    <div class="d-flex flex-column" style="gap:5px;">
      <v-progress-linear
        :model-value="clockify.result.rangeWorkWorkedPercent.value"
        color="light-green-darken-4"
        height="16"
        :striped="!!clockify.timeEntry.working"
        style="font-size:10px;"
        rounded
      >
        {{ clockify.result.rangeWorkWorkedPercent.description }}
      </v-progress-linear>
  
      <v-progress-linear
        :model-value="clockify.result.amountGoalPercent.value"
        color="light-green-darken-4"
        height="16"
        :striped="!!clockify.timeEntry.working"
        style="font-size:10px;"
        rounded
      >
        {{ clockify.result.amountGoalPercent.description }}
      </v-progress-linear>
    </div>

    <br>

    <v-alert color="success" v-if="clockify.timeEntry.working">
      <div>Working:</div>
      <div>{{ clockify.timeEntry.working.description }}</div>
      <div>{{ clockify.timeEntry.working.workedMinutes }} minutos</div>
    </v-alert>

    <br>

    <v-card>
      <v-table>
        <tbody>
          <tr v-for="([k, r]) in Object.entries(clockify.result)">
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
        <v-text-field v-model="clockify.dateStart" label="Start" />
        <v-text-field v-model="clockify.dateFinal" label="Final" />
        <pre>{{ clockify.timeHumanize(100) }}</pre>
        <pre>clockify.currency: {{ clockify.currency }}</pre>
        <pre>clockify.result: {{ clockify.result }}</pre>
        <pre>clockify.dates: {{ clockify.dates }}</pre>
      </v-col>
    </v-row> -->

    <template #drawer>
      <template v-if="clockify.user.data">
        <v-card-text>
          <div class="d-flex align-center">
            <v-avatar>
              <v-img :src="clockify.user.data.profilePicture"></v-img>
            </v-avatar>
            <div class="fw-bold ms-3">{{ clockify.user.data.name }}</div>
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
                      v-model="clockify.storage.token"
                      :class="{ 'security-mode': clockify.storage.securityMode }"
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
                        :items="Object.keys(clockify.currency.rates)"
                        :hide-details="true"
                        style="width:150px;"
                      ></v-autocomplete>
    
                      <v-autocomplete
                        label="Para"
                        v-model="clockify.storage.currencyTo"
                        :items="Object.keys(clockify.currency.rates)"
                        :hide-details="true"
                        style="width:150px;"
                      ></v-autocomplete>
                    </div>
    
                    <v-text-field
                      :label="`Meta (${clockify.storage.currencyFrom})`"
                      v-model.number="clockify.storage.amountGoal"
                      type="number"
                      :hide-details="true"
                      :suffix="`${clockify.currencyConvert(clockify.storage.amountGoal)} ${clockify.storage.currencyTo}`"
                      :class="{ 'security-mode': clockify.storage.securityMode }"
                    />

                    <v-switch
                      v-model="clockify.storage.securityMode"
                      hide-details
                      :label="clockify.storage.securityMode? 'Hidden': 'Shown'"
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
          :class="{ 'security-mode': clockify.storage.securityMode }"
          :label="`À receber (${clockify.storage.currencyFrom})`"
          :model-value="clockify.currencyFormat(clockify.result.amountTotal.value)"
          :suffix="`${clockify.currencyConvert(clockify.result.amountTotal.value)} ${clockify.storage.currencyTo}`"
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
      definePageMeta({
        title: 'Aaa'
      });
    },

    data() {
      return {
        clockify: useClockify({
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
      };
    },
  };
</script>