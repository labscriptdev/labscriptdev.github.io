<template>
  <div>
    <v-table class="rounded">
      <template #default>
        <thead>
          <tr class="bg-primary">
            <td colspan="7" class="pa-0">
              <div class="d-flex align-center pa-2 border">
                <v-btn flat :size="30" icon="mdi-chevron-left" @click="monthAdd(-1)"></v-btn>
                <div
                  class="flex-grow-1 text-center text-uppercase"
                  style="font-size:16px; line-height:20px; white-space:nowrap; font-weight:bold;"
                >
                  {{ month.year }} {{ month.monthName }}
                </div>
                <v-btn flat :size="30" icon="mdi-chevron-right" @click="monthAdd(1)"></v-btn>
              </div>
            </td>
          </tr>
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
                    <v-btn block flat :size="35">{{ d.day }}</v-btn>
                  </slot>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </template>  
    </v-table>
  </div>
</template>

<script>
  export default {
    props: {
      modelValue: {
        type: [Boolean, String],
        // default: this.$dayjs().format('YYYY-MM-DD'),
        default: false,
      },
      dates: {
        type: Array,
        default: () => ([]),
      },
    },
    computed: {
      month: {
        set(value) {},
        get() {
          const d = this.$dayjs(this.modelValue);
          const r = {};
          r.date = d.format('YYYY-MM-DD');
          r.year = d.format('YYYY');
          r.month = d.format('MM');
          r.day = d.format('DD');
          r.monthName = d.format('MMMM');
          r.daysInMonth = d.daysInMonth();
          r.firstDay = d.startOf("month").day();
          r.weekdays = this.$dayjs.weekdays().map(weekday => weekday.substring(0, 3));
          r.days = (() => {
            const dayDefault = {id:null, day:null, dayName:null, dayAbbr:null, dates:[]};
            let days=[];

            for(let i=0; i<r.firstDay; i++) {
              days.push({ ...dayDefault });
            }
            for(let i=1; i<=r.daysInMonth; i++) {
              const dd = d.set('date', i);
              let day = { ...dayDefault };
              day.id = dd.format();
              day.date = dd.format('YYYY-MM-DD');
              day.day = dd.format('DD');
              day.dayName = this.$dayjs.weekdays()[ dd.day() ];
              day.dayAbbr = day.dayName.substring(0, 3);
              days.push(day);
            }

            days = days.map(day => {
              if (!day.id) return day;
              day.dates = this.dates.filter(d => {
                return d.date.startsWith(day.date);
              });
              return day;
            });
            
            const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
            return chunk(days, 7);
          })();
          return r;
        },
      },
    },
    methods: {
      monthAdd(n) {
        let month = this.$dayjs(this.modelValue).add(n, 'month').set('date', 1);
        let today = this.$dayjs();

        if (month.format('YYYY-MM') == today.format('YYYY-MM')) {
          month = month.set('date', today.get('date'));
        }
        else if (month.isBefore(today)) {
          month = month.set('date', month.daysInMonth());
        }
        
        this.$emit('update:modelValue', month.format('YYYY-MM-DD'));
      },
      slotBind(merge = {}) {
        return {
          modelValue: this.modelValue,
          ...merge
        };
      },
    },
  };
</script>