<template>
  <v-layout>
    <v-navigation-drawer
      :model-value="true"
      :permanent="true"
      width="300"
    >
      <v-card-title>Lotto Simulation</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-text-field type="number" label="numberStart" v-model.number="lotto.numberStart"></v-text-field>
        <v-text-field type="number" label="numberFinal" v-model.number="lotto.numberFinal"></v-text-field>
        <v-text-field type="number" label="numberLines" v-model.number="lotto.numberLines"></v-text-field>
      </v-card-text>
    </v-navigation-drawer>

    <v-main style="height:100vh; overflow:auto;">
      <v-table>
        <template #default>
          <tbody>
            <tr v-for="ns in lottoNumbers">
              <td v-for="n in ns" class="py-0 px-1">
                <v-btn
                  block
                  flat
                  @click="lottoBetToggle(n.number)"
                  :color="n.selected? 'success': null"
                  class="ma-0"
                  rounded="0"
                >
                  {{ n.number }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
    </v-main>
  </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        lotto: {
          numberStart: 1,
          numberFinal: 60,
          numberLines: 10,
          betMin: 4,
          betMax: 6,
          bets: [],
        },
      };
    },
    methods: {
      lottoBetToggle(n) {
        const index = this.lotto.bets.indexOf(n);
        (index>=0)? this.lotto.bets.splice(index, 1): this.lotto.bets.push(n);
      },

      // https://www.vitoshacademy.com/lotto/my_script.js
      calculate() {
        let small = this.lotto.betMax;
        let big = this.lotto.numberFinal;
        let play = this.lotto.bets.length;

        const factorial = (value) => {
          if (value<0) return 0;
          if (value==0 || value==1) return 1;
          return value * factorial(value - 1);
        };

        const resultOrder = factorial(big) / factorial(big - small);
        console.log(resultOrder);

        const resultNoOrder = resultOrder / factorial(small);
        console.log(resultNoOrder);
        
        const resultCombinations =  factorial(play) / (factorial(small) * factorial(play - small));
        console.log(resultCombinations);
      },
    },
    computed: {
      lottoNumbers() {
        const initializeArrayWithRange = (start=0, end=10, step = 1) => Array.from({ length: Math.ceil((end - start + 1) / step) }, (_, i) => i * step + start);
        const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size) );

        let numbers = initializeArrayWithRange(this.lotto.numberStart, this.lotto.numberFinal).map(number => {
          const selected = this.lotto.bets.indexOf(number) >= 0;
          return { number, selected };
        });

        // this.calculate();
        return chunk(numbers, this.lotto.numberLines);
      },
    },
  };
</script>