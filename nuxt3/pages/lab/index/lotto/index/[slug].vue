<template>
  <div>
    <v-row>
      <v-col cols="12" md="7">
        <app-table
          :items="lotto.response.data"
          height="80vh"
          v-if="lotto.response.data[0]"
        >
          <template #colgroup="bind">
            <col width="80px" />
            <col width="150px" />
            <col width="*" />
          </template>

          <template #header="bind">
            <th>Sorteio</th>
            <th>Data</th>
            <th>Números</th>
          </template>

          <template #row="bind">
            <td>{{ bind.item.number }}</td>
            <td>{{ bind.item.date }}</td>
            <td>
              <div class="d-flex flex-wrap" style="gap: 6px; padding: 4px">
                <v-btn
                  color="grey-lighten-3"
                  elevation="0"
                  @click="lotto.numbersSet(bind.item.numbers)"
                >
                  <v-icon icon="ic:round-keyboard-double-arrow-right" />
                </v-btn>

                <template v-for="nn in bind.item.numbers">
                  <v-btn
                    color="grey-lighten-3"
                    elevation="0"
                    @click="lotto.numberToggle(nn)"
                    :class="{
                      'bg-primary': lotto.numbers.includes(nn),
                    }"
                  >
                    {{ nn }}
                  </v-btn>
                </template>
              </div>
            </td>
          </template>
        </app-table>
      </v-col>

      <v-col cols="12" md="5">
        <v-text-field
          label="Números"
          v-model="lotto.numbersStr"
          @keyup="lotto.numbersToArray()"
          append-inner-icon="mdi-close"
          @click:appendInner="
            () => {
              lotto.numbersStr = '';
              lotto.numbersToArray();
            }
          "
        />

        <v-table class="border">
          <tbody>
            <template v-for="nns in lotto.table">
              <tr>
                <template v-for="nn in nns">
                  <td class="pa-1">
                    <div
                      style="cursor: pointer"
                      class="pa-2 text-center rounded bg-grey-lighten-3"
                      :class="{
                        'bg-primary': lotto.numbers.includes(nn),
                      }"
                      @click="lotto.numberToggle(nn)"
                    >
                      {{ nn }}
                    </div>
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <br />

    <!-- <div class="border">
      <v-table
        v-if="lotto.response.data[0]"
        density="compact"
        style="margin-right: 14px"
      >
        <colgroup>
          <col width="80px" />
          <col width="*" />
          <col width="50px" />
          <template v-for="(nn, ii) in lotto.response.data[0].numbers">
            <col width="50px" />
          </template>
        </colgroup>
        <thead>
          <tr>
            <th>Sorteio</th>
            <th>Data</th>
            <th></th>
            <template v-for="(nn, ii) in lotto.response.data[0].numbers">
              <th></th>
            </template>
          </tr>
        </thead>
      </v-table>

      <v-virtual-scroll height="50vh" :items="lotto.response.data">
        <template v-slot:default="bind">
          <v-table density="compact">
            <colgroup>
              <col width="80px" />
              <col width="*" />
              <col width="50px" />
              <template v-for="(nn, ii) in bind.item.numbers">
                <col width="50px" />
              </template>
            </colgroup>
            <tbody>
              <tr>
                <td>{{ bind.item.number }}</td>
                <td>{{ bind.item.date }}</td>
                <td></td>
                <template v-for="nn in bind.item.numbers">
                  <td>{{ nn }}</td>
                </template>
              </tr>
            </tbody>
          </v-table>
        </template>
      </v-virtual-scroll>
    </div>
    <br /> -->

    <!-- <v-table v-if="lotto.response.data[0]" density="compact" class="border">
      <colgroup>
        <col width="50px" />
        <col width="*" />
        <col width="50px" />
        <template v-for="(nn, ii) in lotto.response.data[0].numbers">
          <col width="50px" />
        </template>
      </colgroup>
      <thead>
        <tr>
          <th>Sorteio</th>
          <th>Data</th>
          <th></th>
          <template v-for="(nn, ii) in lotto.response.data[0].numbers">
            <th></th>
          </template>
        </tr>
      </thead>

      <tbody>
        <template v-for="o in lotto.response.data">
          <tr>
            <td>{{ o.number }}</td>
            <td>{{ o.date }}</td>
            <td class="pa-1">
              <v-btn
                block
                color="grey-lighten-3"
                elevation="0"
                @click="lotto.numbersSet(o.numbers)"
              >
                <v-icon icon="ic:round-keyboard-double-arrow-right" />
              </v-btn>
            </td>
            <template v-for="nn in o.numbers">
              <td class="pa-1">
                <div
                  class="bg-grey-lighten-2 text-center pa-2 rounded"
                  :class="{
                    'bg-primary': lotto.numbers.includes(nn),
                  }"
                  @click="lotto.numberToggle(nn)"
                >
                  {{ nn }}
                </div>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </v-table> -->

    <!-- <pre>lotto: {{ lotto }}</pre> -->
  </div>
</template>

<script setup>
import { reactive, useRoute, computed, onMounted } from "#imports";
import axios from "axios";

const route = useRoute();

const lotto = reactive({
  url: `https://raw.githubusercontent.com/labscriptdev/static-api/main/data/loteria/${route.params.slug}.json`,
  busy: false,
  numbersStr: "",
  numbers: [],
  numbersToArray() {
    lotto.numbers = lotto.numbersStr
      .split(/[^0-9]/)
      .filter((v) => !!v)
      .map((n) => filter.padStart(n));
  },
  numberToggle(n) {
    const index = lotto.numbers.indexOf(n);
    index >= 0 ? lotto.numbers.splice(index, 1) : lotto.numbers.push(n);
    lotto.numbersStr = lotto.numbers.join(" ");
  },
  numbersSet(nns) {
    lotto.numbers = JSON.parse(JSON.stringify(nns));
    lotto.numbersStr = lotto.numbers.join(" ");
  },
  response: {
    id: null,
    name: null,
    rangeStart: 0,
    rangeFinal: 0,
    rangePerRow: 0,
    data: [],
  },
  table: computed(() => {
    let rows = [],
      row = [];
    for (
      let n = lotto.response.rangeStart;
      n <= lotto.response.rangeFinal;
      n++
    ) {
      row.push(filter.padStart(n));
      if (row.length == lotto.response.rangePerRow) {
        rows.push(row);
        row = [];
      }
    }
    return rows;
  }),
  async load() {
    this.busy = true;
    try {
      let { data } = await axios.get(this.url);
      data.data = data.data.reverse().map((sorteio) => {
        sorteio.numbers = sorteio.numbers.map((n) => {
          return filter.padStart(n);
        });
        return sorteio;
      });
      this.response = data;
    } catch (e) {}
    this.busy = false;
  },
});

const filter = {
  padStart(n) {
    return String(n).padStart(2, "0");
  },
};

onMounted(() => {
  lotto.load();
});
</script>

<!-- <template>
  <div>
    <div v-if="!lotto.response" class="text-center py-3">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      />
    </div>

    <template v-if="lotto.response">
      <v-row no-gutters>
        <v-col cols="4">
          <v-card-text>
            <v-expansion-panels rounded="0">
              <v-expansion-panel
                v-for="(a, i) in analysis.types"
                :key="i"
                :title="a.name"
              >
                <v-expansion-panel-text>
                  <div class="d-flex flex-column" style="gap:15px;">
                    <div v-if="a.goods.length">
                      Bons: <br>
                      {{ a.goods.map(n => n.toString().padStart(2, '0')).join(' - ') }}
                    </div>
                    <div v-if="a.bads.length">
                      Ruins: <br>
                      {{ a.bads.map(n => n.toString().padStart(2, '0')).join(' - ') }}
                    </div>
                    <div>
                      Testes:
                      <template v-for="t in a.tests">
                        <br>
                        <div>{{ t.name }}</div>
                        <v-progress-linear
                          :model-value="t.percent"
                          height="25"
                          striped
                          :color="t.percent>50? 'success': 'error'"
                        >
                          <template #default="{ value }">
                            <div>{{ value.toFixed(1) }}%</div>
                          </template>
                        </v-progress-linear>
                      </template>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <br>

            <v-text-field v-model.number="params.rangeStart" type="number" label="Sorteios de" :min="1" :max="params.rangeFinal-1" />
            <v-text-field v-model.number="params.rangeFinal" type="number" label="Até" :min="params.rangeStart+1" :max="rattles.response.length" />
          </v-card-text>
        </v-col>
  
        <v-col cols="8" class="pa-4" style="height:calc(100vh - 45px); overflow:auto;">
          <v-table>
            <colgroup>
              <col width="100px" >
              <col width="150px" >
              <col width="*" >
            </colgroup>
            <thead>
              <tr>
                <th>Sorteio</th>
                <th>Data</th>
                <th>Números</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="_rattle in getRattlesRange()"
                :key="_rattle.number"
              >
                <td>{{ _rattle.number.toString().padStart(4, '0') }}</td>
                <td>{{ $filter.dateFormat(_rattle.date) }}</td>
                <td>{{ _rattle.numbers.map(n => n.toString().padStart(2, '0')).join(' - ') }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
  import Analysis from '../Analysis';
  
  export default {
    computed: {
      analysis() {
        let rattles = this.getRattlesRange();
        return new Analysis(this.lotto.response, rattles);
      },
    },

    methods: {
      getRattlesRange() {
        return this.rattles.response.filter(rattle => {
          return rattle.number >= this.params.rangeStart && rattle.number <= this.params.rangeFinal;
        });
      },
    },

    data() {
      return {
        params: {
          rangeStart: 0,
          rangeFinal: 0,
        },
        lotto: this.$request({
          url: `https://raw.githubusercontent.com/labscriptdev/static-api/main/data/loteria/${this.$route.params.slug}/index.json`,
          autoSubmit: true,
          response: false,
        }),
        rattles: this.$request({
          url: `https://raw.githubusercontent.com/labscriptdev/static-api/main/data/loteria/${this.$route.params.slug}/all.json`,
          autoSubmit: true,
          response: [],
          onResponse: (resp) => {
            this.params.rangeStart = 1;
            this.params.rangeFinal = resp.length;
            return resp.reverse();
          },
        }),
      };
    },
  };
</script> -->
