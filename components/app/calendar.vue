<template>
  <div>

    <!-- Header -->
    <slot name="header-wrapper" v-bind="slotBind()">
      <div class="bg-primary d-flex align-center pa-2 rounded-t" v-if="header">
        <v-btn
          flat
          :size="30"
          icon="mdi-chevron-left"
          @click="$emit('update:modelValue', month.prev)"
          v-if="month.prev && prevNext"
        />
        <div class="flex-grow-1 text-center text-h6 font-weight-bold text-uppercase">
          <slot name="header-title" v-bind="slotBind()">
            {{ month.year }} - {{ month.monthName }}
          </slot>
        </div>
        <v-btn
          flat
          :size="30"
          icon="mdi-chevron-right"
          @click="$emit('update:modelValue', month.next)"
          v-if="month.next && prevNext"
        />
      </div>
    </slot>

    <div class="overflow-auto">

      <!-- template: month -->
      <template v-if="layout == 'month'">
        <v-table class="rounded">
          <template #default>
            <thead>
              <tr>
                <th
                  v-for="wd in month.weekdays"
                  :key="wd"
                  class="text-center text-uppercase px-0 py-3"
                >
                  {{ wd }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="wdays in month.days">
                <tr>
                  <template v-for="d in wdays">
                    <td class="text-center pa-0">
                      <slot name="day" v-bind="slotBind(d)">
                        <v-btn
                          block
                          flat
                          :rounded="0"
                          :size="35"
                          :color="d.current.day? 'primary': null"
                          :style="{ opacity: (d.current.month ? 1 : .2) }"
                        >{{ d.day }}</v-btn>
                      </slot>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </template>  
        </v-table>
      </template>
  
      <!-- template: week -->
      <template v-if="layout == 'week'">
        <v-table class="rounded">
          <template #default>
            <thead>
              <tr>
                <th class="text-center" v-for="wd in month.weekdays">
                  {{ wd }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="d in month.days">
                  <slot name="day-wrapper" v-bind="slotBind(d)">
                    <v-btn block flat>
                      <slot name="day" v-bind="slotBind(d)">
                        {{ d.day }}
                      </slot>
                    </v-btn>
                  </slot>
                </td>
              </tr>
            </tbody>
          </template>
        </v-table>
      </template>

      <!-- template: year -->
      <template v-if="layout == 'year'">
        <v-row class="mt-2">
          <template v-for="m in yearMonths()">
            <v-col cols="12" lg="3">
              <app-calendar :model-value="m.date" :prev-next="false">
                <template #header-title="d">
                  {{ d.month.monthName }}
                </template>
              </app-calendar>
            </v-col>
          </template>
        </v-row>
      </template>
      
      <!-- template: range -->
      <template v-if="layout == 'range'">
        <v-table class="rounded">
          <template #default>
            <thead>
              <tr>
                <th class="text-center" v-for="d in month.days">
                  {{ d.week.abbr }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="d in month.days">
                  <slot name="day" v-bind="slotBind(d)">
                    <v-btn block flat>
                      {{ d.day }}
                    </v-btn>
                  </slot>
                </td>
              </tr>
            </tbody>
          </template>
        </v-table>
      </template>
    </div>
    
    <!-- <pre>month: {{ month }}</pre> -->
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    props: {
      modelValue: {
        type: [Boolean, String],
        default: false,
      },
      dateStart: {
        type: [Boolean, String],
        default: false,
      },
      dateFinal: {
        type: [Boolean, String],
        default: false,
      },
      dates: {
        type: Array,
        default: () => ([]),
      },
      layout: {
        type: String,
        default: 'month', // month | week | range | year
      },
      header: {
        type: Boolean,
        default: true,
      },
      prevNext: {
        type: Boolean,
        default: true,
      },
      rangeDays: {
        type: Number,
        default: 5,
      },
    },
    
    data() {
      return {
        layouts: {
          month: {
            name: 'month',
            before: (month) => {
              month.dateStart = month.dayjs.startOf('month');
              month.dateFinal = month.dayjs.endOf('month').endOf('day');
              return month;
            },
            after: (month) => {
              month.prev = month.dayjs.add(-1, 'month').format('YYYY-MM-DD');
              month.next = month.dayjs.add(1, 'month').format('YYYY-MM-DD');
              month.days = this.arrChunk(month.days, 7);
              return month;
            },
          },
          week: {
            name: 'week',
            before: (month) => {
              return month;
            },
            after: (month) => {
              month.days = this.arrChunk(month.days, 7);
              let found = false;
              for(let days of month.days) {
                if (found) break;
                for(let day of days) {
                  if (month.date == day.date) {
                    month.days = days;
                    break;
                  }
                }
              }

              month.prev = this.$dayjs(month.days.at(0).date).add(-1, 'day').format('YYYY-MM-DD');
              month.next = this.$dayjs(month.days.at(-1).date).add(1, 'day').format('YYYY-MM-DD');
              return month;
            },
          },
          range: {
            name: 'range',
            before: (month) => {
              month.dateStart = this.$dayjs(this.modelValue).add(-this.rangeDays, 'days');
              month.dateFinal = this.$dayjs(this.modelValue).add(this.rangeDays, 'days').endOf('day');
              return month;
            },
            after: (month) => {
              month.prev = this.$dayjs(this.modelValue).add(-1, 'day').format('YYYY-MM-DD');
              month.next = this.$dayjs(this.modelValue).add(1, 'day').format('YYYY-MM-DD');
              return month;
            },
          },
          year: {
            name: 'year',
            before: (month) => {
              return month;
            },
            after: (month) => {
              return month;
            },
          },
        },
      };
    },

    computed: {
      month: {
        set(value) {},
        get() {
          const dayInfo = (dd) => {
            let day = {};
            day.id = dd.format();
            day.dayjs = dd;
            day.date = dd.format('YYYY-MM-DD');
            day.day = dd.format('DD');
            day.month = dd.format('MM');
            day.year = dd.format('YYYY');
            day.week = {
              day: dd.day(),
              abbr: dd.format('ddd').toUpperCase(),
              name: dd.format('dddd'),
            };

            day.current = {
              day: day.date == r.date,
              month: day.month == r.month,
            };

            return day;
          };
          
          let r = {};
          r.dayjs = this.$dayjs(this.modelValue);
          r.date = r.dayjs.format('YYYY-MM-DD');
          r.year = r.dayjs.format('YYYY');
          r.month = r.dayjs.format('MM');
          r.day = r.dayjs.format('DD');
          r.monthName = r.dayjs.format('MMMM');
          r.daysInMonth = r.dayjs.daysInMonth();
          r.weekdayFirst = r.dayjs.startOf("month").day();
          r.weekdayLast = r.dayjs.endOf("month").day();
          r.weekdays = this.$dayjs.weekdays().map(weekday => weekday.substring(0, 3));
          r.prev = false;
          r.next = false;
          r.dateStart = false;
          r.dateFinal = false;
          r.days = [];

          const layout = this.layouts[ this.layout ] || this.layouts['month'];
          r = layout.before(r);

          r.days = (() => {
            const days = [];

            const diff = this.$dayjs(r.dateStart).diff(r.dateFinal, 'days');
            for(let i=0; i<Math.max(diff, diff*-1); i++) {
              const dd = this.$dayjs(r.dateStart).add(i, 'days');
              days.push(dayInfo(dd));
            }

            return days;
          })();

          r.days = r.days.map(day => {
            day.dates = this.dates.filter(d => {
              return d.date.startsWith(day.date);
            });
            return day;
          });

          r = layout.after(r);

          // this.$debounce(() => {
          //   this.$emit('update:dateStart', r.dateStart);
          //   this.$emit('update:dateFinal', r.dateFinal);
          // }, 200);
          return r;
        },
      },
    },
    methods: {
      slotBind(merge = {}) {
        return {
          modelValue: this.modelValue,
          month: this.month,
          ...merge
        };
      },
      yearMonths() {
        const year = this.$dayjs(this.modelValue).format('YYYY');
        let months = [];
        for(let i=1; i<=12; i++) {
          months.push({
            date: this.$dayjs(`${year}-${i}-01`).format('YYYY-MM-DD'),
          });
        }
        return months;
      },
      arrChunk(arr, size) {
        return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
      },
    },
  };
</script>