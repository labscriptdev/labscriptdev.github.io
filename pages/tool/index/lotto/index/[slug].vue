<template>
  <div>
    <pre>lotto: {{ lotto }}</pre>
    <!-- <v-table>
      <colgroup>
        <col width="100px" >
        <col width="150px" >
        <col width="*" >
        <col width="350px" >
      </colgroup>
      <thead>
        <tr>
          <th>Sorteio</th>
          <th>Data</th>
          <th>Números</th>
          <th>Vencedores</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="_rattle in lotto.response"
        >
          <td>{{ _rattle.number.toString().padStart(4, '0') }}</td>
          <td>{{ $filter.dateFormat(_rattle.date) }}</td>
          <td>{{ _rattle.numbers.map(n => n.toString().padStart(2, '0')).join(', ') }}</td>
          <td class="py-1">
            <template v-for="_win in _rattle.winners">
              <small class="d-block" v-if="_win.total>0">
                {{ _win.name }}: {{ _win.total }}
                (R$ {{ $filter.numberFormat(_win.amount) }} para cada)
              </small>
            </template>
          </td>
        </tr>
      </tbody>
    </v-table> -->
  </div>
</template>

<script>
  import Algorithms from '../Algorithms';
  
  export default {
    data() {
      return {
        lotto: this.$request({
          url: `https://raw.githubusercontent.com/labscriptdev/static-api/main/data/loteria/${this.$route.params.slug}/all.json`,
          autoSubmit: true,
          response: new Algorithms([]),
          onResponse(resp) {
            return new Algorithms(resp);
          },
        }),
      };
    },
  };
</script>