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
            style="gap:2px; padding:2px; min-width:50px; height:250px;"
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
                :title="e.description"
                class="text-center overflow-hidden"
                :class="{
                  'bg-green-lighten-2': (clockify2.timeEntry.working && clockify2.timeEntry.working.id==e.id),
                  'bg-grey-lighten-2': !(clockify2.timeEntry.working && clockify2.timeEntry.working.id==e.id),
                }"
                :style="{ height: `${e.workedMinutesPercent}%`, fontSize: '12px' }"
              >
                {{ e.workedMinutes }}min
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <v-alert color="success" v-if="clockify2.timeEntry.working">
      <div>Working:</div>
      <div>{{ clockify2.timeEntry.working.description }}</div>
      <div>{{ clockify2.timeEntry.working.workedMinutes }} minutos</div>
    </v-alert>

    <br>

    <v-card>
      <v-table>
        <colgroup>
          <col width="200px">
          <col width="*">
          <col width="120px">
          <col width="120px">
        </colgroup>
        <tbody>
          <tr v-for="([k, r]) in Object.entries(clockify2.result)">
            <th>{{ k }}</th>
            <th>{{ r.description }}</th>
            <td>{{ r.value }}</td>
            <td>{{ r.formatted }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <br>

    <v-row no-gutter>
      <v-col cols="4" class="overflow-auto">
        <v-text-field v-model="clockify2.dateStart" label="Start" />
        <v-text-field v-model="clockify2.dateFinal" label="Final" />
        <pre>clockify2.timeEntry.workedMinutes: {{ clockify2.timeEntry.workedMinutes }}</pre>
        <!-- <pre>clockify2.storage: {{ clockify2.storage }}</pre> -->
        <pre>clockify2.result: {{ clockify2.result }}</pre>
        <pre>clockify2.dates: {{ clockify2.dates }}</pre>
      </v-col>
      <!-- <v-col cols="4">
        <v-text-field v-model="calendarDate.date" label="Date" />
        <pre>calendarDate: {{ calendarDate }}</pre>
      </v-col> -->
      <!-- <v-col cols="4">
        <v-text-field v-model="calendarRange.rangeStart" label="Start" />
        <v-text-field v-model="calendarRange.rangeFinal" label="Final" />
        <pre>calendarRange: {{ calendarRange }}</pre>
      </v-col> -->
      <v-col cols="8">
        <v-autocomplete
          label="Currency"
          v-model="currency.from"
          :items="Object.keys(currency.rates)"
          :loading="currency.loading"
        >
          <template #append-inner>
            <div style="white-space:nowrap;">
              1 {{ currency.from }} = {{ currency.rates[ currency.to ] }} {{ currency.to }}
            </div>
          </template>
        </v-autocomplete>
        <pre>currency: {{ currency }}</pre>
      </v-col>
    </v-row>

    <v-select label="Display" v-model="calendarDisplay" :items="['year', 'month', 'week', 'range']"></v-select>
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
                        :items="clockify.currency.items.map(item => item.code)"
                        :hide-details="true"
                        style="width:150px;"
                      ></v-autocomplete>
    
                      <v-autocomplete
                        label="Para"
                        v-model="clockify2.storage.currencyTo"
                        :items="clockify.currency.items.map(item => item.code)"
                        :hide-details="true"
                        style="width:150px;"
                      ></v-autocomplete>
                    </div>
    
                    <v-text-field
                      :label="`Meta (${clockify2.storage.currencyFrom})`"
                      v-model.number="clockify2.storage.amountGoal"
                      type="number"
                      :hide-details="true"
                      :suffix="`${$filter.numberFormat(clockify.currencyConverted(clockify2.storage.amountGoal))} ${clockify2.storage.currencyTo}`"
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
          </div>
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
                <a href="https://app.clockify.me/user/settings" target="_blank">
                  Acesse sua tela de configurações Clockify para gerar o token.
                </a><br><br>
                <v-text-field
                  label="Token"
                  v-model="clockify2.storage.token"
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
                    :items="clockify.currency.items.map(item => item.code)"
                    :hide-details="true"
                    style="width:150px;"
                  ></v-autocomplete>

                  <v-autocomplete
                    label="Para"
                    v-model="clockify2.storage.currencyTo"
                    :items="clockify.currency.items.map(item => item.code)"
                    :hide-details="true"
                    style="width:150px;"
                  ></v-autocomplete>
                </div>

                <v-text-field
                  :label="`Meta (${clockify2.storage.currencyFrom})`"
                  v-model.number="clockify2.storage.amountGoal"
                  type="number"
                  :hide-details="true"
                  :suffix="`${$filter.numberFormat(clockify.currencyConverted(clockify2.storage.amountGoal))} ${clockify2.storage.currencyTo}`"
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
        currency: useCurrency(),
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