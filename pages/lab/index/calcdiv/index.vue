<template>
  <app-layout>
    <v-row>
      <v-col cols="4">
        <v-table>
          <thead>
            <tr>
              <th>Pessoa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="_user in calculator.users" :key="_user.id">
              <td><v-text-field v-model="_user.name" :hide-details="true" variant="plain" /></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col cols="4">
        <v-table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="_spend in calculator.spends" :key="_spend.id">
              <td><v-text-field v-model="_spend.name" :hide-details="true" variant="plain" /></td>
              <td><v-text-field v-model.number="_spend.amount" :hide-details="true" variant="plain" /></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col cols="4">
        <v-table>
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="_user in result.users" :key="_user.id">
              <td>{{ _user.name }}</td>
              <td>{{ _user.amount }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <pre>result: {{ result }}</pre>
    <pre>$data: {{ $data }}</pre>
  </app-layout>
</template>

<script>
  import Calculator from './Calculator';

  export default {
    meta: {
      active: false,
      icon: 'mdi-calculator',
      name: 'Calculadora de gastos',
      description: 'Calculadora de gastos com divisão por pessoas e tempo de uso',
    },

    mounted() {
      this.calculator.demo();
    },

    data() {
      return {
        calculator: new Calculator(),
      };
    },

    computed: {
      result() {
        return this.calculator.result();
      },
    },
  };
</script>