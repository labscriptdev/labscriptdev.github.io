<template>
  <div>
    <div v-if="!lotto.response" class="text-center py-3">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      />
    </div>

    <template v-if="lotto.response">
      <!-- <v-card elevation="0">
        <v-card-title>{{ lotto.response.name }}</v-card-title>
        <v-divider />
      </v-card> -->
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
</script>