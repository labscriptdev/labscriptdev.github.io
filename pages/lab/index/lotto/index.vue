<template>
  <app-layout title="Loteria" container-width="100%">
    <nuxt-page />

    <template #drawer>
      <v-card-title>Loteria</v-card-title>
      
      <v-divider />
      <v-list>
        <v-list-item
          v-for="_type in lottoTypes.response"
          :key="_type.id"
          :to="`/lab/lotto/${_type.id}`"
        >{{ _type.name }}</v-list-item>
      </v-list>
    </template>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: true,
      icon: 'mdi-slot-machine',
      name: 'Loteria',
      description: 'Aplicação de simulação lotérica',
    },

    data() {
      return {
        lottoTypes: this.$request({
          url: 'https://raw.githubusercontent.com/labscriptdev/static-api/main/data/loteria/index.json',
          autoSubmit: true,
          response: [],
        }),
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