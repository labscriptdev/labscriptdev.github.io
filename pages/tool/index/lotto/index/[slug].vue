<template>
  <div>
    <div v-if="!lotto.response" class="text-center py-3">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mx-auto"
      />
    </div>

    <div class="d-flex flex-column" style="height:100vh;" v-if="lotto.response">
      <div>
        <v-card rounded="0">
          <v-card-title>{{ lotto.response.name }}</v-card-title>
          <v-divider />
          <v-table>
            <colgroup>
              <col width="*" />
              <col width="40%" />
              <col width="40%" />
            </colgroup>
            <thead>
              <tr>
                <th>Algoritmo</th>
                <th>Bons</th>
                <th>Ruins</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="a in analysis.types"
              >
                <td>{{ a.name }}</td>
                <td>{{ a.goods.map(n => n.toString().padStart(2, '0')).join(' - ') }}</td>
                <td>{{ a.bads.map(n => n.toString().padStart(2, '0')).join(' - ') }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </div>

      <div class="flex-grow-1" style="overflow:auto;">
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
              v-for="_rattle in rattles.response"
              :key="_rattle.number"
            >
              <td>{{ _rattle.number.toString().padStart(4, '0') }}</td>
              <td>{{ $filter.dateFormat(_rattle.date) }}</td>
              <td>{{ _rattle.numbers.map(n => n.toString().padStart(2, '0')).join(' - ') }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </div>
</template>

<script>
  import Analysis from '../Analysis';
  
  export default {
    computed: {
      analysis() {
        return new Analysis(this.lotto.response, this.rattles.response);
      },
    },

    data() {
      return {
        lotto: this.$request({
          url: `https://raw.githubusercontent.com/labscriptdev/static-api/main/data/loteria/${this.$route.params.slug}/index.json`,
          autoSubmit: true,
          response: false,
        }),
        rattles: this.$request({
          url: `https://raw.githubusercontent.com/labscriptdev/static-api/main/data/loteria/${this.$route.params.slug}/all.json`,
          autoSubmit: true,
          response: [],
        }),
      };
    },
  };
</script>